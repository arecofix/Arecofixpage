import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Producto, Cliente, ServicioTecnico, Admin
import jwt
import datetime
import sys
from functools import wraps

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


# --- INVENTARIO (PRODUCTOS) ---

@app.route('/api/productos', methods=['GET'])
@token_required
def get_productos(current_user):
    productos = Producto.query.all()
    return jsonify([p.to_dict() for p in productos])

@app.route('/api/productos', methods=['POST'])
@token_required
def add_producto(current_user):
    data = request.json
    nuevo = Producto(
        nombre=data.get('nombre'),
        stock=data.get('stock', 0),
        precio_costo=data.get('precio_costo', 0.0),
        precio_venta=data.get('precio_venta', 0.0),
        categoria=data.get('categoria', 'Repuesto')
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

# --- CLIENTES ---

@app.route('/api/clientes', methods=['GET'])
@token_required
def get_clientes(current_user):
    clientes = Cliente.query.all()
    return jsonify([c.to_dict() for c in clientes])

@app.route('/api/clientes', methods=['POST'])
@token_required
def add_cliente(current_user):
    data = request.json
    nuevo = Cliente(
        nombre=data.get('nombre'),
        telefono=data.get('telefono'),
        dni=data.get('dni'),
        email=data.get('email')
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

# --- SERVICIOS TÉCNICOS ---

@app.route('/api/servicios', methods=['GET'])
@token_required
def get_servicios(current_user):
    servicios = ServicioTecnico.query.all()
    return jsonify([s.to_dict() for s in servicios])

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
            db.session.add(Producto(nombre="Display iPhone 12 Pro", stock=5, precio_venta=75000))
            db.session.commit()
            print("Base de datos local inicializada con semilla básica.")
            
    # Iniciar Hilo de Sincronización en Segundo Plano
    start_sync_thread(app)
            
    # Servidor local en el puerto 5000
    app.run(debug=True, port=5000, use_reloader=False)
