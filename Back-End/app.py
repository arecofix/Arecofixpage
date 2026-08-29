import os
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Producto, Cliente, ServicioTecnico, Admin, Marca, Categoria, Order, OrderItem, CashMovement
import jwt
import datetime
import sys
from functools import wraps
import requests
import psycopg2
import json
from flask import Response, stream_with_context
import werkzeug

# 1. Configuración de Rutas Seguras y Compatibles (Windows/Linux)
if getattr(sys, 'frozen', False):
    # PyInstaller extracts bundled files to _MEIPASS
    bundle_dir = getattr(sys, '_MEIPASS', Path(sys.executable).resolve().parent)
    BASE_DIR = Path(bundle_dir)
    
    # Store sqlite db in %APPDATA%\Arecofix for read/write access
    app_data = Path(os.environ.get('APPDATA', 'C:/')) / 'Arecofix'
    app_data.mkdir(parents=True, exist_ok=True)
    db_path = app_data / 'arecofix_local.sqlite'
    
    # Copy seed db if it doesn't exist
    seed_db = BASE_DIR / 'arecofix_local.sqlite'
    if not db_path.exists() and seed_db.exists():
        import shutil
        shutil.copy(seed_db, db_path)
        
    env_path = BASE_DIR / ".env"
else:
    BASE_DIR = Path(__file__).resolve().parent
    env_path = BASE_DIR / ".env"
    db_path = BASE_DIR / 'arecofix_local.sqlite'

# Cargar variables de entorno (Supabase etc)
load_dotenv(dotenv_path=env_path)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4200")

app = Flask(__name__)

# 2. Habilitar CORS de manera robusta
CORS(app, resources={r"/api/*": {"origins": [FRONTEND_URL, "http://localhost:4200", "http://localhost:1420"]}})

# --- SQLite LOCAL Configuration ---
# Usamos pathlib para asegurar compatibilidad de barras
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'local-offline-engine-secret-key-2026')

db.init_app(app)

# ----------------- Rutas de la API -----------------

@app.route('/', methods=['GET'])
def home():
    """Ruta raíz para verificar desde el navegador sin recibir 404."""
    return jsonify({
        "message": "¡Motor Local de Arecofix funcionando! Para verificar el estado de la API, visita /api/health"
    })

@app.route('/api/health', methods=['GET'])
def get_health():

    """Endpoint para verificar que el backend está vivo y accesible (Health Check)."""
    data_folder = BASE_DIR / "data" / "uploads"
    return jsonify({
        "status": "ok",
        "message": "Backend Flask funcionando correctamente",
        "os_path_example": str(data_folder),
        "server": "Arecofix Engine",
        "version": "1.0.0",
        "mode": "Offline-First"
    })

# --- AUTHENTICATION & JWT DECORATOR ---

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Support generic Bearer token
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
                
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = Admin.query.filter_by(id=data['id']).first()
            if not current_user:
                raise Exception("User not found")
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except Exception as e:
            return jsonify({'error': 'Token is invalid!', 'message': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# --- AUTHENTICATION (ADMIN OFFLINE LOGIN) ---

@app.route('/api/login', methods=['POST'])
def offline_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    admin = Admin.query.filter_by(username=username).first()
    
    if admin and check_password_hash(admin.password_hash, password):
        token = jwt.encode({
            'id': admin.id,
            'username': admin.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            "message": "Login offline exitoso",
            "token": token,
            "admin": {
                "id": admin.id, 
                "username": admin.username,
                "branch_id": admin.branch_id,
                "role": admin.role
            }
        }), 200
        
    return jsonify({"error": "Credenciales inválidas"}), 401


# --- INVENTARIO (MARCAS Y CATEGORIAS) ---

@app.route('/api/marcas', methods=['GET'])
# @token_required # Todo: add back when auth is integrated with angular
def get_marcas():
    # current_user param removed for testing without token
    marcas = Marca.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [m.to_dict() for m in marcas], "total": len(marcas)})

@app.route('/api/marcas', methods=['POST'])
def add_marca():
    data = request.json
    nueva = Marca(
        name=data.get('name'),
        description=data.get('description'),
        is_active=data.get('is_active', True)
    )
    db.session.add(nueva)
    db.session.commit()
    return jsonify(nueva.to_dict()), 201

@app.route('/api/marcas/<string:id>', methods=['PUT'])
def update_marca(id):
    marca = Marca.query.get_or_404(id)
    data = request.json
    if 'name' in data: marca.name = data['name']
    if 'description' in data: marca.description = data['description']
    if 'is_active' in data: marca.is_active = data['is_active']
    marca.is_dirty = True
    marca.is_synced = False
    db.session.commit()
    return jsonify(marca.to_dict()), 200

@app.route('/api/marcas/<string:id>', methods=['DELETE'])
def delete_marca(id):
    marca = Marca.query.get_or_404(id)
    marca.deleted_at = datetime.datetime.utcnow()
    marca.is_dirty = True
    marca.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

@app.route('/api/categorias', methods=['GET'])
def get_categorias():
    categorias = Categoria.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [c.to_dict() for c in categorias], "total": len(categorias)})

@app.route('/api/categorias', methods=['POST'])
def add_categoria():
    data = request.json
    nueva = Categoria(
        name=data.get('name'),
        description=data.get('description'),
        is_active=data.get('is_active', True),
        parent_id=data.get('parent_id')
    )
    db.session.add(nueva)
    db.session.commit()
    return jsonify(nueva.to_dict()), 201

@app.route('/api/categorias/<string:id>', methods=['PUT'])
def update_categoria(id):
    categoria = Categoria.query.get_or_404(id)
    data = request.json
    if 'name' in data: categoria.name = data['name']
    if 'description' in data: categoria.description = data['description']
    if 'is_active' in data: categoria.is_active = data['is_active']
    if 'parent_id' in data: categoria.parent_id = data['parent_id']
    categoria.is_dirty = True
    categoria.is_synced = False
    db.session.commit()
    return jsonify(categoria.to_dict()), 200

@app.route('/api/categorias/<string:id>', methods=['DELETE'])
def delete_categoria(id):
    categoria = Categoria.query.get_or_404(id)
    categoria.deleted_at = datetime.datetime.utcnow()
    categoria.is_dirty = True
    categoria.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

# --- SUBIDA DE IMÁGENES OFFLINE ---

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = werkzeug.utils.secure_filename(file.filename)
        upload_folder = os.path.join(app.root_path, 'data', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, filename))
        return jsonify({"url": f"/api/files/{filename}"}), 201

@app.route('/api/files/<string:filename>', methods=['GET'])
def get_file(filename):
    from flask import send_from_directory
    upload_folder = os.path.join(app.root_path, 'data', 'uploads')
    return send_from_directory(upload_folder, filename)

# --- INVENTARIO (PRODUCTOS) ---

@app.route('/api/productos', methods=['GET'])
def get_productos():
    productos = Producto.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [p.to_dict() for p in productos], "total": len(productos)})

@app.route('/api/productos', methods=['POST'])
def add_producto():
    data = request.json
    nuevo = Producto(
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price', 0.0),
        cost_price=data.get('cost_price', 0.0),
        stock=data.get('stock', 0),
        category_id=data.get('category_id'),
        brand_id=data.get('brand_id'),
        sku=data.get('sku'),
        barcode=data.get('barcode')
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

@app.route('/api/productos/<string:id>', methods=['PUT'])
def update_producto(id):
    producto = Producto.query.get_or_404(id)
    data = request.json
    if 'name' in data: producto.name = data['name']
    if 'description' in data: producto.description = data['description']
    if 'price' in data: producto.price = data['price']
    if 'cost_price' in data: producto.cost_price = data['cost_price']
    if 'stock' in data: producto.stock = data['stock']
    if 'category_id' in data: producto.category_id = data['category_id']
    if 'brand_id' in data: producto.brand_id = data['brand_id']
    if 'sku' in data: producto.sku = data['sku']
    if 'barcode' in data: producto.barcode = data['barcode']
    producto.is_dirty = True
    producto.is_synced = False
    db.session.commit()
    return jsonify(producto.to_dict()), 200

@app.route('/api/productos/<string:id>', methods=['DELETE'])
def delete_producto(id):
    producto = Producto.query.get_or_404(id)
    producto.deleted_at = datetime.datetime.utcnow()
    producto.is_dirty = True
    producto.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

# --- CLIENTES ---

@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    clientes = Cliente.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [c.to_dict() for c in clientes], "total": len(clientes)})

@app.route('/api/clientes', methods=['POST'])
def add_cliente():
    data = request.json
    nuevo = Cliente(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        phone=data.get('phone'),
        dni=data.get('dni'),
        email=data.get('email')
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

@app.route('/api/clientes/<string:id>', methods=['PUT'])
def update_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    data = request.json
    if 'first_name' in data: cliente.first_name = data['first_name']
    if 'last_name' in data: cliente.last_name = data['last_name']
    if 'phone' in data: cliente.phone = data['phone']
    if 'email' in data: cliente.email = data['email']
    if 'dni' in data: cliente.dni = data['dni']
    cliente.is_dirty = True
    cliente.is_synced = False
    db.session.commit()
    return jsonify(cliente.to_dict()), 200

@app.route('/api/clientes/<string:id>', methods=['DELETE'])
def delete_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    cliente.deleted_at = datetime.datetime.utcnow()
    cliente.is_dirty = True
    cliente.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

# --- SERVICIOS TÉCNICOS ---

@app.route('/api/servicios', methods=['GET'])
def get_servicios():
    servicios = ServicioTecnico.query.filter_by(deleted_at=None).all()
    return jsonify({"data": [s.to_dict() for s in servicios], "total": len(servicios)})

@app.route('/api/servicios', methods=['POST'])
def add_servicio():
    data = request.json
    nuevo = ServicioTecnico(
        client_id=data.get('client_id'),
        device_id=data.get('device_id'),
        falla=data.get('falla'),
        estado_id=data.get('estado_id', 1),
        precio_presupuesto=data.get('precio_presupuesto', 0.0),
        observaciones=data.get('observaciones')
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

@app.route('/api/servicios/<string:id>', methods=['PUT'])
def update_servicio(id):
    servicio = ServicioTecnico.query.get_or_404(id)
    data = request.json
    if 'client_id' in data: servicio.client_id = data['client_id']
    if 'device_id' in data: servicio.device_id = data['device_id']
    if 'falla' in data: servicio.falla = data['falla']
    if 'estado_id' in data: servicio.estado_id = data['estado_id']
    if 'precio_presupuesto' in data: servicio.precio_presupuesto = data['precio_presupuesto']
    if 'observaciones' in data: servicio.observaciones = data['observaciones']
    servicio.is_dirty = True
    servicio.is_synced = False
    db.session.commit()
    return jsonify(servicio.to_dict()), 200

@app.route('/api/servicios/<string:id>', methods=['DELETE'])
def delete_servicio(id):
    servicio = ServicioTecnico.query.get_or_404(id)
    servicio.deleted_at = datetime.datetime.utcnow()
    servicio.is_dirty = True
    servicio.is_synced = False
    db.session.commit()
    return jsonify({"message": "Eliminado"}), 200

# --- RUTAS DE FINANZAS (Caja) ---
@app.route('/api/finances', methods=['GET', 'POST', 'OPTIONS'])
def manage_finances():
    if request.method == 'OPTIONS':
        return '', 204
        
    if request.method == 'GET':
        movements = CashMovement.query.filter_by(deleted_at=None).order_by(CashMovement.created_at.desc()).all()
        return jsonify({
            "data": [
                {
                    "id": m.id,
                    "tenant_id": m.tenant_id,
                    "branch_id": m.branch_id,
                    "amount": m.amount,
                    "type": m.type,
                    "category": m.category,
                    "payment_method": m.payment_method,
                    "reference_id": m.reference_id,
                    "notes": m.notes,
                    "created_by": m.created_by,
                    "created_at": m.created_at.isoformat() if m.created_at else None
                } for m in movements
            ],
            "total": len(movements)
        })

    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        m = CashMovement(
            id=data.get('id', str(uuid.uuid4())),
            tenant_id=data.get('tenant_id'),
            branch_id=data.get('branch_id'),
            amount=data.get('amount', 0),
            type=data.get('type', 'income'),
            category=data.get('category', 'otros'),
            payment_method=data.get('payment_method', 'cash'),
            reference_id=data.get('reference_id'),
            notes=data.get('notes'),
            created_by=data.get('created_by'),
            is_synced=False,
            is_dirty=True
        )
        db.session.add(m)
        db.session.commit()
        return jsonify({"message": "Movimiento de caja creado localmente", "id": m.id}), 201

# --- RUTAS DE ORDENES ---
@app.route('/api/orders', methods=['GET', 'POST', 'OPTIONS'])
def manage_orders():
    if request.method == 'OPTIONS':
        return '', 204
        
    if request.method == 'GET':
        orders = Order.query.filter_by(deleted_at=None).order_by(Order.created_at.desc()).all()
        return jsonify({
            "data": [
                {
                    "id": o.id,
                    "order_number": o.order_number,
                    "customer_name": o.customer_name,
                    "customer_email": o.customer_email,
                    "customer_phone": o.customer_phone,
                    "status": o.status,
                    "subtotal": o.subtotal,
                    "tax": o.tax,
                    "discount": o.discount,
                    "total": o.total,
                    "payment_method": o.payment_method,
                    "notes": o.notes,
                    "items": [
                        {
                            "id": item.id,
                            "product_id": item.product_id,
                            "product_name": item.product_name,
                            "quantity": item.quantity,
                            "unit_price": item.unit_price,
                            "subtotal": item.subtotal
                        } for item in o.items
                    ],
                    "created_at": o.created_at.isoformat() if o.created_at else None
                } for o in orders
            ],
            "total": len(orders)
        })

    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        o = Order(
            id=data.get('id', str(uuid.uuid4())),
            order_number=data.get('order_number'),
            user_id=data.get('user_id'),
            customer_name=data.get('customer_name', 'Invitado'),
            customer_email=data.get('customer_email'),
            customer_phone=data.get('customer_phone'),
            shipping_address=json.dumps(data.get('shipping_address')) if data.get('shipping_address') else None,
            status=data.get('status', 'pending'),
            subtotal=data.get('subtotal', 0),
            tax=data.get('tax', 0),
            discount=data.get('discount', 0),
            total=data.get('total', 0),
            payment_method=data.get('payment_method'),
            tenant_id=data.get('tenant_id'),
            branch_id=data.get('branch_id'),
            is_synced=False,
            is_dirty=True
        )
        
        items_data = data.get('items', [])
        for item_data in items_data:
            item = OrderItem(
                id=item_data.get('id', str(uuid.uuid4())),
                order_id=o.id,
                product_id=item_data.get('product_id'),
                product_name=item_data.get('product_name'),
                quantity=item_data.get('quantity', 1),
                unit_price=item_data.get('unit_price', 0),
                subtotal=item_data.get('subtotal', 0),
                is_synced=False,
                is_dirty=True
            )
            o.items.append(item)
            
        db.session.add(o)
        db.session.commit()
        return jsonify({"message": "Orden creada localmente", "id": o.id}), 201

@app.route('/api/orders/<order_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
def manage_single_order(order_id):
    if request.method == 'OPTIONS':
        return '', 204
        
    order = Order.query.get(order_id)
    if not order or order.deleted_at:
        return jsonify({"error": "Order not found"}), 404
        
    if request.method == 'GET':
        return jsonify({
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status,
            "total": order.total,
            "customer_name": order.customer_name,
            "items": [
                {
                    "id": i.id,
                    "product_id": i.product_id,
                    "product_name": i.product_name,
                    "quantity": i.quantity,
                    "unit_price": i.unit_price,
                    "subtotal": i.subtotal
                } for i in order.items
            ]
        })
        
    if request.method == 'PUT':
        data = request.json
        if 'status' in data:
            order.status = data['status']
        if 'payment_method' in data:
            order.payment_method = data['payment_method']
        
        order.is_synced = False
        order.is_dirty = True
        db.session.commit()
        return jsonify({"message": "Orden actualizada"}), 200
        
    if request.method == 'DELETE':
        order.deleted_at = datetime.datetime.now(datetime.timezone.utc)
        order.is_synced = False
        order.is_dirty = True
        db.session.commit()
        return jsonify({"message": "Orden eliminada localmente"}), 200

# --- OFFLINE RAG CHATBOT ---

LOCAL_DB_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
OLLAMA_URL = "http://localhost:11434"

@app.route('/api/chat/offline', methods=['POST'])
def chat_offline():
    data = request.json
    question = data.get('question', '')
    tenant_id = data.get('tenant_id')
    history = data.get('history', [])

    if not question or not tenant_id:
        return jsonify({"error": "Faltan datos requeridos"}), 400

    def generate_sse():
        try:
            print("[Offline RAG] 1. Vectorizando pregunta con Ollama...")
            # 1. Vectorizar la pregunta localmente
            emb_res = requests.post(f"{OLLAMA_URL}/api/embeddings", json={
                "model": "nomic-embed-text",
                "prompt": question
            })
            if not emb_res.ok:
                print(f"[Offline RAG] Error Ollama embeddings: {emb_res.text}")
                yield f"data: {json.dumps({'error': 'Error de Ollama (Embeddings)'})}\n\n"
                return
            
            embedding = emb_res.json().get('embedding')

            print("[Offline RAG] 2. Buscando en Postgres local...")
            # 2. Búsqueda vectorial en PostgreSQL
            conn = psycopg2.connect(LOCAL_DB_URL)
            cur = conn.cursor()
            
            emb_str = f"[{','.join(map(str, embedding))}]"
            
            cur.execute("""
                SELECT title, content, source_type, source_url
                FROM public.knowledge_base
                WHERE tenant_id = %s
                ORDER BY embedding <=> %s::vector
                LIMIT 5
            """, (tenant_id, emb_str))
            
            results = cur.fetchall()
            cur.close()
            conn.close()

            print(f"[Offline RAG] Encontrados {len(results)} fragmentos.")
            sources = []
            context_text = ""
            for i, row in enumerate(results):
                title, content, source_type, source_url = row
                sources.append({
                    "title": title,
                    "source_type": source_type,
                    "source_url": source_url,
                    "similarity": 0.9
                })
                context_text += f"[{i+1}] {title}\n{content}\n\n"

            # Enviar fuentes como primer evento SSE
            yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"

            print("[Offline RAG] 3. Generando respuesta con Qwen...")
            # 3. Prompting
            sys_prompt = f"Eres el asistente oficial de Arecofix. Responde basándote SOLO en este contexto oficial de la empresa:\n{context_text}\nSi no sabes la respuesta o no está en el contexto, dilo cortésmente."

            messages = [{"role": "system", "content": sys_prompt}]
            messages.extend(history)
            messages.append({"role": "user", "content": question})

            # 4. Generación Streaming
            chat_res = requests.post(f"{OLLAMA_URL}/api/chat", json={
                "model": "qwen2.5-coder:7b",
                "messages": messages,
                "stream": True
            }, stream=True)

            for line in chat_res.iter_lines():
                if line:
                    chunk = json.loads(line)
                    if 'message' in chunk and 'content' in chunk['message']:
                        token = chunk['message']['content']
                        yield f"data: {json.dumps({'response': token})}\n\n"
            
            print("[Offline RAG] Respuesta finalizada.")
            yield "data: [DONE]\n\n"

        except Exception as e:
            print(f"[Offline RAG] EXCEPCIÓN: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(stream_with_context(generate_sse()), mimetype='text/event-stream')


# --- INICIALIZACIÓN ---

if __name__ == '__main__':
    from sync_engine import start_sync_thread
    with app.app_context():
        # Crear la base de datos local al iniciar si no existe
        db.create_all()
        
        # Semilla inicial para Administrador (Offline Login)
        if not Admin.query.first():
            hashed_pw = generate_password_hash("admin123")
            db.session.add(Admin(username="admin", password_hash=hashed_pw))
            db.session.commit()
            print("Usuario Admin (offline) creado. User: admin | Pass: admin123")

        # Semilla inicial para testing si está vacío
        if not Producto.query.first():
            db.session.add(Producto(name="Display iPhone 12 Pro", stock=5, price=75000))
            db.session.commit()
            print("Base de datos local inicializada con semilla básica.")
            
    # Iniciar Hilo de Sincronización en Segundo Plano
    start_sync_thread(app)
            
    # Servidor local en el puerto 5000
    app.run(debug=True, port=5000, use_reloader=False)
