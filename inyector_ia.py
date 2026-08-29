import requests
import json
import sys

# 1. Configuración
# La URL local donde corre Wrangler (Workers) por defecto
WORKER_URL = "http://127.0.0.1:8787/ingest"

# Debes reemplazar esto con el WORKER_SECRET que tengas en tu .dev.vars de Cloudflare, 
# o dejarlo vacío si tu worker local no lo requiere para pruebas.
WORKER_SECRET = "un_secret_fuerte_para_desarrollo" 

# Un tenant de prueba
TENANT_ID = "00000000-0000-0000-0000-000000000000"

def inyectar_conocimiento(titulo, contenido, categoria):
    print(f"Enviando '{titulo}' a tu Cloudflare Worker local ({WORKER_URL})...")
    
    payload = {
        "tenant_id": TENANT_ID,
        "title": titulo,
        "content": contenido,
        "source_type": "custom",
        "metadata": {
            "category": categoria
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {WORKER_SECRET}"
    }
    
    try:
        response = requests.post(WORKER_URL, json=payload, headers=headers)
        
        # Si el worker devuelve error (ej. 401 Unauthorized), lanzamos una excepción
        response.raise_for_status()
        
        result = response.json()
        print("¡Éxito!")
        print(f"Mensaje del Worker: {result.get('message')}")
        print(f"Chunks procesados y guardados en Supabase: {result.get('chunks_processed')}")
        
    except requests.exceptions.ConnectionError:
        print(f"ERROR: No se pudo conectar a {WORKER_URL}.")
        print("Asegúrate de que tu Cloudflare Worker esté corriendo (ej. 'npx wrangler dev' en la carpeta del worker).")
    except requests.exceptions.HTTPError as err:
        print(f"ERROR DEL WORKER ({response.status_code}):", response.text)
    except Exception as e:
        print("Error inesperado:", e)

# 2. El texto de prueba (Módulo de Identidad)
texto_identidad = """
# Módulo 1: Identidad y Contacto
Arecofix es un servicio técnico profesional especializado en microelectrónica y reparación de dispositivos móviles.
Operamos y recibimos equipos en el Barrio La Paz, Marcos Paz, provincia de Buenos Aires.
Atendemos tanto consultas de presupuestos para clientes finales como reparaciones avanzadas a nivel de placa.
"""

# 3. Ejecutar la inyección
if __name__ == "__main__":
    inyectar_conocimiento(
        titulo="Identidad y Ubicación", 
        contenido=texto_identidad, 
        categoria="customer_public"
    )
