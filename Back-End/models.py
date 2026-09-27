from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class Admin(db.Model):
    """Gestión de Administradores (Offline Login)."""
    __tablename__ = 'admins'
    def __init__(self, username: str, password_hash: str, branch_id: str = None, role: str = 'admin'):
        self.username = username
        self.password_hash = password_hash
        self.branch_id = branch_id
        self.role = role
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_synced = db.Column(db.Boolean, default=False)
    branch_id = db.Column(db.String(36), nullable=True)
    role = db.Column(db.String(20), default='admin')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Marca(db.Model):
    """Gestión de Marcas."""
    __tablename__ = 'brands'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    tenant_id = db.Column(db.String(36), nullable=True)
    
    is_synced = db.Column(db.Boolean, default=False)
    is_dirty = db.Column(db.Boolean, default=True)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "tenant_id": self.tenant_id,
            "is_synced": self.is_synced,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class Categoria(db.Model):
    """Gestión de Categorías."""
    __tablename__ = 'categories'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    tenant_id = db.Column(db.String(36), nullable=True)
    parent_id = db.Column(db.String(36), nullable=True)
    
    is_synced = db.Column(db.Boolean, default=False)
    is_dirty = db.Column(db.Boolean, default=True)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "parent_id": self.parent_id,
            "tenant_id": self.tenant_id,
            "is_synced": self.is_synced,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class Producto(db.Model):
    """Gestión de Inventario."""
    __tablename__ = 'productos'
    def __init__(self, name: str, stock: int = 0, price: float = 0.0, **kwargs):
        super().__init__(**kwargs)
        self.name = name
        self.stock = stock
        self.price = price
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=True)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, default=0.0)
    cost_price = db.Column(db.Float, default=0.0)
    currency = db.Column(db.String(10), default="ARS")
    stock = db.Column(db.Integer, default=0)
    category_id = db.Column(db.String(36), db.ForeignKey('categories.id'), nullable=True)
    brand_id = db.Column(db.String(36), db.ForeignKey('brands.id'), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    is_global = db.Column(db.Boolean, default=False)
    sku = db.Column(db.String(50), nullable=True)
    barcode = db.Column(db.String(50), nullable=True)
    tenant_id = db.Column(db.String(36), nullable=True)
    branch_id = db.Column(db.String(36), nullable=True)
    
    # Flags para Sincronización Offline-First
    is_synced = db.Column(db.Boolean, default=False)
    is_dirty = db.Column(db.Boolean, default=True)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "price": self.price,
            "cost_price": self.cost_price,
            "currency": self.currency,
            "stock": self.stock,
            "category_id": self.category_id,
            "brand_id": self.brand_id,
            "image_url": self.image_url,
            "is_active": self.is_active,
            "is_featured": self.is_featured,
            "is_global": self.is_global,
            "sku": self.sku,
            "barcode": self.barcode,
            "tenant_id": self.tenant_id,
            "branch_id": self.branch_id,
            "is_synced": self.is_synced,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class Cliente(db.Model):
    """Gestión de Clientes (Profiles en Supabase)."""
    __tablename__ = 'clientes'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    dni = db.Column(db.String(20))
    tenant_id = db.Column(db.String(36), nullable=True)
    
    servicios = db.relationship('ServicioTecnico', backref='cliente', lazy=True)
    
    is_synced = db.Column(db.Boolean, default=False)
    is_dirty = db.Column(db.Boolean, default=True)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "email": self.email,
            "dni": self.dni,
            "tenant_id": self.tenant_id,
            "is_synced": self.is_synced,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class ServicioTecnico(db.Model):
    """Gestión de reparaciones (Core de Arecofix)."""
    __tablename__ = 'servicios_tecnicos'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    client_id = db.Column(db.String(36), db.ForeignKey('clientes.id'), nullable=False)
    device_id = db.Column(db.String(36), nullable=True) # Referencia al equipo/device
    tenant_id = db.Column(db.String(36), nullable=True)
    branch_id = db.Column(db.String(36), nullable=True)
    
    # Datos básicos de reparación offline
    falla = db.Column(db.String(255))
    estado_id = db.Column(db.Integer, default=1)
    precio_presupuesto = db.Column(db.Float, default=0.0)
    observaciones = db.Column(db.Text)
    
    is_synced = db.Column(db.Boolean, default=False)
    is_dirty = db.Column(db.Boolean, default=True)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "device_id": self.device_id,
            "falla": self.falla,
            "estado_id": self.estado_id,
            "precio_presupuesto": self.precio_presupuesto,
            "observaciones": self.observaciones,
            "tenant_id": self.tenant_id,
            "branch_id": self.branch_id,
            "is_synced": self.is_synced,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class Order(db.Model):
    """Gestión de Órdenes de Compra/Venta."""
    __tablename__ = 'orders'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    order_number = db.Column(db.String(50), nullable=True)
    user_id = db.Column(db.String(36), nullable=True)
    customer_name = db.Column(db.String(150), nullable=False)
    customer_email = db.Column(db.String(150), nullable=True)
    customer_phone = db.Column(db.String(50), nullable=True)
    shipping_address = db.Column(db.Text, nullable=True) # Almacenado como JSON en string
    status = db.Column(db.String(50), nullable=False, default='pending')
    
    subtotal = db.Column(db.Float, default=0.0)
    tax = db.Column(db.Float, default=0.0)
    discount = db.Column(db.Float, default=0.0)
    total = db.Column(db.Float, default=0.0)
    
    payment_method = db.Column(db.String(50), nullable=True)
    payment_ticket_code = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    
    tenant_id = db.Column(db.String(36), nullable=True)
    branch_id = db.Column(db.String(36), nullable=True)
    
    items = db.relationship('OrderItem', backref='order', lazy=True)
    
    is_synced = db.Column(db.Boolean, default=False)
    is_dirty = db.Column(db.Boolean, default=True)
    
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('productos.id'), nullable=True)
    product_name = db.Column(db.String(150), nullable=True)
    product_sku = db.Column(db.String(100), nullable=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    unit_price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    tenant_id = db.Column(db.String(36), nullable=True)
    
    is_synced = db.Column(db.Boolean, default=False)
    is_dirty = db.Column(db.Boolean, default=True)

class CashMovement(db.Model):
    """Gestión de Finanzas y Caja."""
    __tablename__ = 'cash_movements'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    tenant_id = db.Column(db.String(36), nullable=True)
    branch_id = db.Column(db.String(36), nullable=True)
    
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False) # 'income' or 'expense'
    category = db.Column(db.String(50), nullable=False)
    payment_method = db.Column(db.String(50), nullable=True)
    reference_id = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    
    created_by = db.Column(db.String(36), nullable=True)
    
    is_synced = db.Column(db.Boolean, default=False)
    is_dirty = db.Column(db.Boolean, default=True)
    
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
