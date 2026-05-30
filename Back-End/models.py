from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class Admin(db.Model):
    """Gestión de Administradores (Offline Login)."""
    __tablename__ = 'admins'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_synced = db.Column(db.Boolean, default=False)
    branch_id = db.Column(db.String(36), nullable=True)
    role = db.Column(db.String(20), default='admin')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Producto(db.Model):
    """Gestión de Inventario."""
    __tablename__ = 'productos'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nombre = db.Column(db.String(100), nullable=False)
    stock = db.Column(db.Integer, default=0)
    precio_costo = db.Column(db.Float, default=0.0)
    precio_venta = db.Column(db.Float, default=0.0)
    categoria = db.Column(db.String(50), default="Repuesto")
    
    # Flags para Sincronización Offline-First
    is_synced = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "stock": self.stock,
            "precio_costo": self.precio_costo,
            "precio_venta": self.precio_venta,
            "categoria": self.categoria,
            "is_synced": self.is_synced
        }

class Cliente(db.Model):
    """Gestión de Clientes."""
    __tablename__ = 'clientes'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nombre = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20))
    email = db.Column(db.String(100))
    dni = db.Column(db.String(20), unique=True)
    servicios = db.relationship('ServicioTecnico', backref='cliente', lazy=True)
    
    is_synced = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "telefono": self.telefono,
            "dni": self.dni,
            "is_synced": self.is_synced
        }

class ServicioTecnico(db.Model):
    """Gestión de reparaciones (Core de Arecofix)."""
    __tablename__ = 'servicios_tecnicos'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    cliente_id = db.Column(db.String(36), db.ForeignKey('clientes.id'), nullable=False)
    equipo = db.Column(db.String(100), nullable=False)
    falla = db.Column(db.String(255))
    estado = db.Column(db.String(50), default="Ingresado")
    precio_presupuesto = db.Column(db.Float, default=0.0)
    fecha_ingreso = db.Column(db.DateTime, default=datetime.utcnow)
    observaciones = db.Column(db.Text)
    
    is_synced = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "cliente": self.cliente.nombre if self.cliente else "N/A",
            "equipo": self.equipo,
            "estado": self.estado,
            "fecha": self.fecha_ingreso.strftime("%Y-%m-%d %H:%M"),
            "is_synced": self.is_synced
        }
