-- Esquema Base de D1 para Failover (Modo Lectura)
-- NOTA: Este esquema de SQLite es una version simplificada del esquema de Supabase
-- optimizada exclusivamente para lecturas (failover) ante caídas de la base de datos principal.

CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subdomain TEXT NOT NULL,
    custom_domain TEXT,
    logo_url TEXT,
    primary_color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    category_id TEXT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
);

-- Indices para busquedas frecuentes
CREATE INDEX idx_tenants_domain ON tenants(custom_domain);
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
