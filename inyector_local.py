import psycopg2
import json
from sentence_transformers import SentenceTransformer

# 1. Configuración de credenciales locales (Docker)
DB_URL = "postgresql://arecofix:eze321@localhost:5432/arecofix_dev"
TENANT_ID = "00000000-0000-0000-0000-000000000000"

print("Cargando modelo local de IA (BAAI/bge-base-en-v1.5)...")
# Este es el MISMO modelo que usa tu Cloudflare Worker, pero corriendo 100% en local.
# La primera vez que lo corras tardará un poquito en descargar el modelo (~400MB).
model = SentenceTransformer('BAAI/bge-base-en-v1.5')

def inyectar_conocimiento_local(titulo, contenido, categoria):
    print(f"Generando vector (embedding) localmente para: {titulo}...")
    
    # Genera el embedding de 768 dimensiones
    vector = model.encode(contenido).tolist()
    
    print("Conectando a la base de datos PostgreSQL local...")
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    query = """
        INSERT INTO public.knowledge_base 
        (tenant_id, source_type, title, content, metadata, embedding, chunk_index)
        VALUES (%s, 'custom', %s, %s, %s, %s, 0)
    """
    
    metadata = json.dumps({"category": categoria})
    
    try:
        cur.execute(query, (TENANT_ID, titulo, contenido, metadata, vector))
        conn.commit()
        print("¡Texto inyectado con éxito en PostgreSQL local usando IA local!")
    except Exception as e:
        print("Error al insertar en la base de datos:", e)
        conn.rollback()
    finally:
        cur.close()
        conn.close()

# 2. El texto de prueba (Módulo de Identidad)
texto_identidad = """
# Módulo 1: Identidad y Contacto
Arecofix es un servicio técnico profesional especializado en microelectrónica y reparación de dispositivos móviles.
Operamos y recibimos equipos en el Barrio La Paz, Marcos Paz, provincia de Buenos Aires.
Atendemos tanto consultas de presupuestos para clientes finales como reparaciones avanzadas a nivel de placa.
"""

# 3. Ejecutar la inyección
if __name__ == "__main__":
    inyectar_conocimiento_local(
        titulo="Identidad y Ubicación", 
        contenido=texto_identidad, 
        categoria="customer_public"
    )
