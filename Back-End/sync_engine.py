import os
import time
import threading
import urllib.request
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path
from models import db, Producto, Cliente, ServicioTecnico, Marca, Categoria, Order, OrderItem, CashMovement

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
        # 0. Sincronizar Marcas
        marcas_no_sync = Marca.query.filter_by(is_synced=False).all()
        if marcas_no_sync:
            print(f"[Sync Engine] Encontradas {len(marcas_no_sync)} marcas no sincronizadas.")
            for m in marcas_no_sync:
                try:
                    data = {
                        "id": m.id,
                        "name": m.name,
                        "description": m.description,
                        "is_active": m.is_active,
                        "tenant_id": m.tenant_id,
                        "deleted_at": m.deleted_at.isoformat() if m.deleted_at else None
                    }
                    supabase.table("brands").upsert(data).execute()
                    m.is_synced = True
                    m.is_dirty = False
                    db.session.commit()
                    print(f"  -> Marca {m.name} sincronizada.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar marca {m.name}: {e}")

        # 0.1 Sincronizar Categorias
        cat_no_sync = Categoria.query.filter_by(is_synced=False).all()
        if cat_no_sync:
            print(f"[Sync Engine] Encontradas {len(cat_no_sync)} categorias no sincronizadas.")
            for c in cat_no_sync:
                try:
                    data = {
                        "id": c.id,
                        "name": c.name,
                        "description": c.description,
                        "is_active": c.is_active,
                        "parent_id": c.parent_id,
                        "tenant_id": c.tenant_id,
                        "deleted_at": c.deleted_at.isoformat() if c.deleted_at else None
                    }
                    supabase.table("categories").upsert(data).execute()
                    c.is_synced = True
                    c.is_dirty = False
                    db.session.commit()
                    print(f"  -> Categoria {c.name} sincronizada.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar categoria {c.name}: {e}")

        # 1. Sincronizar Clientes (Profiles) - Debe ir antes que reparaciones
        clientes_no_sync = Cliente.query.filter_by(is_synced=False).all()
        if clientes_no_sync:
            print(f"[Sync Engine] Encontrados {len(clientes_no_sync)} clientes no sincronizados.")
            for c in clientes_no_sync:
                try:
                    data = {
                        "id": c.id,
                        "first_name": c.first_name,
                        "last_name": c.last_name,
                        "phone": c.phone,
                        "email": c.email,
                        "dni": c.dni,
                        "tenant_id": c.tenant_id,
                        "deleted_at": c.deleted_at.isoformat() if c.deleted_at else None
                    }
                    supabase.table("profiles").upsert(data).execute()
                    
                    c.is_synced = True
                    c.is_dirty = False
                    db.session.commit()
                    print(f"  -> Cliente {c.first_name} sincronizado.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar cliente {c.first_name}: {e}")

        # 2. Sincronizar Productos
        productos_no_sync = Producto.query.filter_by(is_synced=False).all()
        if productos_no_sync:
            print(f"[Sync Engine] Encontrados {len(productos_no_sync)} productos no sincronizados.")
            for p in productos_no_sync:
                try:
                    data = {
                        "id": p.id,
                        "name": p.name,
                        "slug": p.slug,
                        "description": p.description,
                        "price": p.price,
                        "cost_price": p.cost_price,
                        "currency": p.currency,
                        "stock": p.stock,
                        "category_id": p.category_id,
                        "brand_id": p.brand_id,
                        "image_url": p.image_url,
                        "is_active": p.is_active,
                        "is_featured": p.is_featured,
                        "is_global": p.is_global,
                        "sku": p.sku,
                        "barcode": p.barcode,
                        "tenant_id": p.tenant_id,
                        "branch_id": p.branch_id,
                        "deleted_at": p.deleted_at.isoformat() if p.deleted_at else None
                    }
                    supabase.table("products").upsert(data).execute()
                    
                    p.is_synced = True
                    p.is_dirty = False
                    db.session.commit()
                    print(f"  -> Producto {p.name} sincronizado.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar producto {p.name}: {e}")

        # 3. Sincronizar Servicios Técnicos (Repairs)
        servicios_no_sync = ServicioTecnico.query.filter_by(is_synced=False).all()
        if servicios_no_sync:
            print(f"[Sync Engine] Encontrados {len(servicios_no_sync)} reparaciones no sincronizadas.")
            for s in servicios_no_sync:
                try:
                    data = {
                        "id": s.id,
                        "client_id": s.client_id,
                        "device_id": s.device_id,
                        "falla": s.falla,
                        "estado_id": s.estado_id,
                        "precio_presupuesto": s.precio_presupuesto,
                        "observaciones": s.observaciones,
                        "tenant_id": s.tenant_id,
                        "branch_id": s.branch_id,
                        "deleted_at": s.deleted_at.isoformat() if s.deleted_at else None
                    }
                    supabase.table("repairs").upsert(data).execute()
                    
                    s.is_synced = True
                    s.is_dirty = False
                    db.session.commit()
                    print(f"  -> Reparación sincronizada.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar reparación: {e}")

        # 4. Sincronizar Órdenes (Orders)
        orders_no_sync = Order.query.filter_by(is_synced=False).all()
        if orders_no_sync:
            print(f"[Sync Engine] Encontradas {len(orders_no_sync)} ordenes no sincronizadas.")
            for o in orders_no_sync:
                try:
                    data = {
                        "id": o.id,
                        "order_number": o.order_number,
                        "user_id": o.user_id,
                        "customer_name": o.customer_name,
                        "customer_email": o.customer_email,
                        "customer_phone": o.customer_phone,
                        "shipping_address": o.shipping_address,
                        "status": o.status,
                        "subtotal": o.subtotal,
                        "tax": o.tax,
                        "discount": o.discount,
                        "total": o.total,
                        "payment_method": o.payment_method,
                        "payment_ticket_code": o.payment_ticket_code,
                        "notes": o.notes,
                        "tenant_id": o.tenant_id,
                        "branch_id": o.branch_id,
                        "deleted_at": o.deleted_at.isoformat() if o.deleted_at else None
                    }
                    supabase.table("orders").upsert(data).execute()
                    
                    o.is_synced = True
                    o.is_dirty = False
                    db.session.commit()
                    print(f"  -> Orden sincronizada.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar orden: {e}")

        # 4.1 Sincronizar Order Items
        items_no_sync = OrderItem.query.filter_by(is_synced=False).all()
        if items_no_sync:
            print(f"[Sync Engine] Encontrados {len(items_no_sync)} order items no sincronizados.")
            for i in items_no_sync:
                try:
                    data = {
                        "id": i.id,
                        "order_id": i.order_id,
                        "product_id": i.product_id,
                        "product_name": i.product_name,
                        "product_sku": i.product_sku,
                        "quantity": i.quantity,
                        "unit_price": i.unit_price,
                        "subtotal": i.subtotal,
                        "tenant_id": i.tenant_id
                    }
                    supabase.table("order_items").upsert(data).execute()
                    
                    i.is_synced = True
                    i.is_dirty = False
                    db.session.commit()
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar order item: {e}")

        # 5. Sincronizar Finanzas (Cash Movements)
        finances_no_sync = CashMovement.query.filter_by(is_synced=False).all()
        if finances_no_sync:
            print(f"[Sync Engine] Encontrados {len(finances_no_sync)} movimientos de caja no sincronizados.")
            for f in finances_no_sync:
                try:
                    data = {
                        "id": f.id,
                        "tenant_id": f.tenant_id,
                        "branch_id": f.branch_id,
                        "amount": f.amount,
                        "type": f.type,
                        "category": f.category,
                        "payment_method": f.payment_method,
                        "reference_id": f.reference_id,
                        "notes": f.notes,
                        "created_by": f.created_by
                    }
                    supabase.table("cash_movements").upsert(data).execute()
                    
                    f.is_synced = True
                    f.is_dirty = False
                    db.session.commit()
                    print(f"  -> Movimiento de caja sincronizado.")
                except Exception as e:
                    print(f"  [Error] Fallo al sincronizar movimiento de caja: {e}")

def run_sync_loop(app, interval_seconds=60):
    """Bucle infinito que ejecuta la sincronización periódicamente."""
    print("[Sync Engine] Iniciando demonio de sincronización en segundo plano...")
    while True:
        try:
            if check_internet():
                sync_data(app)
            else:
                pass # No hacer spam en consola si no hay internet
        except Exception as e:
            # Absorbemos el golpe de fallas de red, 402, 500, etc. sin matar el demonio
            print(f"[Sync Engine] Fallo crítico absorbido (reintentando en próximo ciclo): {e}")
        time.sleep(interval_seconds)

def start_sync_thread(app):
    """Inicia el demonio en un hilo separado para no bloquear Flask."""
    thread = threading.Thread(target=run_sync_loop, args=(app,), daemon=True)
    thread.start()
