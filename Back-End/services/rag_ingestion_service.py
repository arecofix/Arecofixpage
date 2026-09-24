"""
Arecofix — Servicio de Ingesta RAG
===================================
Llama al Cloudflare Worker (embedding-ingestion) para indexar
productos, servicios y manuales en la knowledge_base de Supabase.

Uso desde Flask:
    from services.rag_ingestion_service import RagIngestionService
    rag = RagIngestionService()
    rag.ingest_product(product_dict, tenant_id)
"""

import os
import json
import logging
import requests
from typing import Optional

logger = logging.getLogger(__name__)


class RagIngestionService:
    """
    Interfaz entre Flask y el Cloudflare Worker de generación de embeddings.
    
    El Worker se encarga de:
      - Dividir el texto en chunks
      - Llamar a Workers AI para generar los embeddings
      - Guardar los vectores en Supabase knowledge_base
    
    Este servicio solo construye el payload y hace el HTTP POST.
    """

    def __init__(self) -> None:
        self.worker_url: str = os.getenv(
            "EMBEDDING_WORKER_URL",
            "https://arecofix-embedding-ingestion.tu-subdominio.workers.dev",
        )
        self.worker_secret: str = os.getenv("EMBEDDING_WORKER_SECRET", "")

        if not self.worker_secret:
            logger.warning(
                "[RagIngestionService] EMBEDDING_WORKER_SECRET no configurado. "
                "Las llamadas al Worker serán rechazadas."
            )

    def _post(self, endpoint: str, payload: dict) -> dict:
        """Realiza el POST al Worker con el header de autenticación."""
        url = f"{self.worker_url.rstrip('/')}{endpoint}"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.worker_secret}",
        }
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.Timeout:
            logger.error("[RagIngestionService] Timeout al llamar al Worker: %s", url)
            raise
        except requests.exceptions.HTTPError as e:
            logger.error(
                "[RagIngestionService] HTTP error %s: %s",
                e.response.status_code,
                e.response.text,
            )
            raise

    def ingest_product(self, product: dict, tenant_id: str) -> dict:
        """
        Indexa un producto en la knowledge_base.
        
        El contenido vectorizado incluye: nombre, descripción, categoría y SKU
        para maximizar la recuperación semántica en búsquedas de lenguaje natural.
        
        Args:
            product: Dict con campos del producto (name, description, sku, category, price)
            tenant_id: UUID del tenant propietario
        
        Returns:
            Respuesta JSON del Worker (chunks_processed, etc.)
        """
        # Construir texto rico para el embedding
        content_parts = [
            f"Producto: {product.get('name', '')}",
            f"Descripción: {product.get('description', '')}",
        ]
        if product.get("category"):
            content_parts.append(f"Categoría: {product['category']}")
        if product.get("sku"):
            content_parts.append(f"SKU: {product['sku']}")
        if product.get("price"):
            content_parts.append(f"Precio: ${product['price']}")
        if product.get("brand"):
            content_parts.append(f"Marca: {product['brand']}")

        content = "\n".join(filter(None, content_parts))

        payload = {
            "tenant_id": tenant_id,
            "title": product.get("name", "Producto sin nombre"),
            "content": content,
            "source_type": "product",
            "source_id": product.get("id"),
            "metadata": {
                "sku": product.get("sku"),
                "price": product.get("price"),
                "category": product.get("category"),
                "brand": product.get("brand"),
            },
        }

        logger.info(
            "[RagIngestionService] Indexando producto '%s' (tenant: %s)",
            product.get("name"),
            tenant_id,
        )
        return self._post("/ingest", payload)

    def ingest_service(self, service: dict, tenant_id: str) -> dict:
        """
        Indexa un servicio de reparación en la knowledge_base.
        
        Args:
            service: Dict con campos del servicio (name, description, price_range, duration)
            tenant_id: UUID del tenant
        """
        content_parts = [
            f"Servicio de reparación: {service.get('name', '')}",
            f"Descripción: {service.get('description', '')}",
        ]
        if service.get("price_range"):
            content_parts.append(f"Rango de precio: {service['price_range']}")
        if service.get("duration"):
            content_parts.append(f"Tiempo estimado: {service['duration']}")

        payload = {
            "tenant_id": tenant_id,
            "title": service.get("name", "Servicio sin nombre"),
            "content": "\n".join(filter(None, content_parts)),
            "source_type": "service",
            "source_id": service.get("id"),
            "metadata": {
                "price_range": service.get("price_range"),
                "duration": service.get("duration"),
            },
        }

        return self._post("/ingest", payload)

    def ingest_manual(
        self,
        title: str,
        text_content: str,
        tenant_id: str,
        source_id: Optional[str] = None,
        source_url: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> dict:
        """
        Indexa el contenido de texto extraído de un manual técnico (PDF).
        
        El texto ya debe estar extraído (ej. con PyMuPDF o pdfplumber).
        El Worker se encarga del chunking.
        
        Args:
            title:        Título del manual (ej. "Manual Sony KD-55X80K")
            text_content: Texto plano extraído del PDF
            tenant_id:    UUID del tenant
            source_id:    UUID del registro en la BD (opcional)
            source_url:   URL del PDF en Cloudflare R2 (opcional)
            metadata:     Metadatos adicionales (marca, modelo, año, etc.)
        """
        payload = {
            "tenant_id": tenant_id,
            "title": title,
            "content": text_content,
            "source_type": "manual",
            "source_id": source_id,
            "source_url": source_url,
            "metadata": metadata or {},
        }

        logger.info(
            "[RagIngestionService] Indexando manual '%s' (%d chars, tenant: %s)",
            title,
            len(text_content),
            tenant_id,
        )
        return self._post("/ingest", payload)

    def delete_document(self, source_id: str, tenant_id: str) -> bool:
        """
        Elimina todos los chunks de un documento de la knowledge_base.
        Útil cuando se elimina un producto o se actualiza un manual.
        
        Returns:
            True si se eliminó correctamente.
        """
        url = f"{self.worker_url.rstrip('/')}/document/{source_id}?tenant_id={tenant_id}"
        headers = {"Authorization": f"Bearer {self.worker_secret}"}
        try:
            response = requests.delete(url, headers=headers, timeout=15)
            response.raise_for_status()
            logger.info(
                "[RagIngestionService] Chunks eliminados: source_id=%s tenant=%s",
                source_id,
                tenant_id,
            )
            return True
        except requests.exceptions.HTTPError as e:
            logger.error(
                "[RagIngestionService] Error al eliminar chunks: %s",
                e.response.text,
            )
            return False
