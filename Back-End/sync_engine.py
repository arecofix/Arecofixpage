import os
import time
import threading
import urllib.request
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path
from models import db, Producto, Cliente, ServicioTecnico

# Cargar variables de entorno
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY and "your_project_url" not in SUPABASE_URL:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_internet(host="http://1.1.1.1"):
    """Verifica si hay conexión a internet."""
    try:
        urllib.request.urlopen(host, timeout=3)
        return True
    except:
        return False

def sync_data(app):
    """
    Función que busca registros locales no sincronizados y los envía a Supabase.
    Requiere el contexto de la aplicación Flask para usar SQLAlchemy.
    """
    if not supabase:
        print("[Sync Engine] Supabase no configurado en .env. Omitiendo sincronización.")
        return

    with app.app_context():
        # 1. Sincronizar Productos
        productos_no_sync = Producto.query.filter_by(is_synced=False).all()
        if productos_no_sync:
            print(f"[Sync Engine] Encontrados {len(productos_no_sync)} productos no sincronizados.")
            for p in productos_no_sync:
                try:
                    data = {
                        "id": p.id,
                        "nombre": p.nombre,
                        "stock": p.stock,
                        "precio_costo": p.precio_costo,
                        "precio_venta": p.precio_venta,
                        "categoria": p.categoria,
                        # Asegúrate de que las columnas coincidan con tu tabla en Supabase
                    }
                    # Upsert (inserta o actualiza según el ID)
                    response = supabase.table("productos").upsert(data).execute()
                    
                    # Si fue exitoso, marcamos como sincronizado
                    p.is_synced = True
                    db.session.commit()
                    print(f"  -> Producto {p.nombre} sincronizado.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar producto {p.nombre}: {e}")

        # 2. Sincronizar Clientes
        clientes_no_sync = Cliente.query.filter_by(is_synced=False).all()
        if clientes_no_sync:
            print(f"[Sync Engine] Encontrados {len(clientes_no_sync)} clientes no sincronizados.")
            for c in clientes_no_sync:
                try:
                    data = {
                        "id": c.id,
                        "nombre": c.nombre,
                        "telefono": c.telefono,
                        "email": c.email,
                        "dni": c.dni
                    }
                    supabase.table("clientes").upsert(data).execute()
                    
                    c.is_synced = True
                    db.session.commit()
                    print(f"  -> Cliente {c.nombre} sincronizado.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar cliente {c.nombre}: {e}")

        # 3. Sincronizar Servicios Técnicos
        servicios_no_sync = ServicioTecnico.query.filter_by(is_synced=False).all()
        if servicios_no_sync:
            print(f"[Sync Engine] Encontrados {len(servicios_no_sync)} servicios no sincronizados.")
            for s in servicios_no_sync:
                try:
                    data = {
                        "id": s.id,
                        "cliente_id": s.cliente_id,
                        "equipo": s.equipo,
                        "falla": s.falla,
                        "estado": s.estado,
                        "precio_presupuesto": s.precio_presupuesto,
                        "fecha_ingreso": s.fecha_ingreso.isoformat() if s.fecha_ingreso else None,
                        "observaciones": s.observaciones
                    }
                    supabase.table("servicios_tecnicos").upsert(data).execute()
                    
                    s.is_synced = True
                    db.session.commit()
                    print(f"  -> Servicio {s.equipo} sincronizado.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar servicio {s.equipo}: {e}")

def run_sync_loop(app, interval_seconds=60):
    """Bucle infinito que ejecuta la sincronización periódicamente."""
    print("[Sync Engine] Iniciando demonio de sincronización en segundo plano...")
    while True:
        if check_internet():
            sync_data(app)
        else:
            pass # No hacer spam en consola si no hay internet
        time.sleep(interval_seconds)

def start_sync_thread(app):
    """Inicia el demonio en un hilo separado para no bloquear Flask."""
    thread = threading.Thread(target=run_sync_loop, args=(app,), daemon=True)
    thread.start()
