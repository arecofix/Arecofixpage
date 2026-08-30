BEGIN TRANSACTION;
CREATE TABLE admins (
	id VARCHAR(36) NOT NULL, 
	username VARCHAR(50) NOT NULL, 
	password_hash VARCHAR(255) NOT NULL, 
	is_synced BOOLEAN, 
	branch_id VARCHAR(36), 
	role VARCHAR(20), 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	UNIQUE (username)
);
INSERT INTO "admins" VALUES('a33ff29f-9b1d-433d-b12a-16d3eb0fb311','admin','scrypt:32768:8:1$UsRhBuNEURwvxRlH$f8e8234c90c29fb377244423a69f8cdd0226432b75a6e0416e79903a3533ed38cf22019c7eba9abdcba63ad78c2813ee9836d0df738a368b0672c77ca29c92fd',0,NULL,'admin','2026-08-28 04:22:49.908679');
CREATE TABLE brands (
	id VARCHAR(36) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	is_active BOOLEAN, 
	tenant_id VARCHAR(36), 
	is_synced BOOLEAN, 
	is_dirty BOOLEAN, 
	deleted_at DATETIME, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "brands" VALUES('47fd4c48-332e-4880-96a4-0e78a63be627','Samsung',NULL,1,NULL,0,1,NULL,'2026-08-29 00:00:24.538240','2026-08-29 00:00:24.538247');
CREATE TABLE cash_movements (
	id VARCHAR(36) NOT NULL, 
	tenant_id VARCHAR(36), 
	branch_id VARCHAR(36), 
	amount FLOAT NOT NULL, 
	type VARCHAR(20) NOT NULL, 
	category VARCHAR(50) NOT NULL, 
	payment_method VARCHAR(50), 
	reference_id VARCHAR(100), 
	notes TEXT, 
	created_by VARCHAR(36), 
	is_synced BOOLEAN, 
	is_dirty BOOLEAN, 
	deleted_at DATETIME, 
	created_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "cash_movements" VALUES('f060c34e-4ce5-42ab-8f61-1c081dbf9b1d',NULL,NULL,75000.0,'income','sale','cash','2f1cb163-4838-4bb6-ab9b-e4ae82ebb0b8','Venta POS - Ticket #2f1cb163',NULL,0,1,NULL,'2026-08-29 00:28:07.225599');
CREATE TABLE categories (
	id VARCHAR(36) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	is_active BOOLEAN, 
	tenant_id VARCHAR(36), 
	parent_id VARCHAR(36), 
	is_synced BOOLEAN, 
	is_dirty BOOLEAN, 
	deleted_at DATETIME, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "categories" VALUES('ad9a23f5-3b5e-46e3-a886-35df42d9a294','Repuestos','repuestos para telefonos celulares',1,NULL,NULL,0,1,NULL,'2026-08-29 00:01:04.447042','2026-08-29 00:01:04.447045');
CREATE TABLE clientes (
	id VARCHAR(36) NOT NULL, 
	first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100), 
	phone VARCHAR(20), 
	email VARCHAR(100), 
	dni VARCHAR(20), 
	tenant_id VARCHAR(36), 
	is_synced BOOLEAN, 
	is_dirty BOOLEAN, 
	deleted_at DATETIME, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
CREATE TABLE order_items (
	id VARCHAR(36) NOT NULL, 
	order_id VARCHAR(36) NOT NULL, 
	product_id VARCHAR(36), 
	product_name VARCHAR(150), 
	product_sku VARCHAR(100), 
	quantity INTEGER NOT NULL, 
	unit_price FLOAT NOT NULL, 
	subtotal FLOAT NOT NULL, 
	tenant_id VARCHAR(36), 
	is_synced BOOLEAN, 
	is_dirty BOOLEAN, 
	PRIMARY KEY (id), 
	FOREIGN KEY(order_id) REFERENCES orders (id), 
	FOREIGN KEY(product_id) REFERENCES productos (id)
);
INSERT INTO "order_items" VALUES('3b688247-142c-4fbf-95ba-20f43a2b9e4b','2f1cb163-4838-4bb6-ab9b-e4ae82ebb0b8','95b2f4ed-8178-4d9a-89e9-b44f5bc76fbc','Display iPhone 12 Pro',NULL,1,75000.0,75000.0,NULL,0,1);
CREATE TABLE orders (
	id VARCHAR(36) NOT NULL, 
	order_number VARCHAR(50), 
	user_id VARCHAR(36), 
	customer_name VARCHAR(150) NOT NULL, 
	customer_email VARCHAR(150), 
	customer_phone VARCHAR(50), 
	shipping_address TEXT, 
	status VARCHAR(50) NOT NULL, 
	subtotal FLOAT, 
	tax FLOAT, 
	discount FLOAT, 
	total FLOAT, 
	payment_method VARCHAR(50), 
	payment_ticket_code VARCHAR(100), 
	notes TEXT, 
	tenant_id VARCHAR(36), 
	branch_id VARCHAR(36), 
	is_synced BOOLEAN, 
	is_dirty BOOLEAN, 
	deleted_at DATETIME, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "orders" VALUES('2f1cb163-4838-4bb6-ab9b-e4ae82ebb0b8',NULL,NULL,'Consumidor Final',NULL,NULL,NULL,'completed',75000.0,0.0,0.0,75000.0,'efectivo',NULL,NULL,NULL,NULL,0,1,NULL,'2026-08-29 00:28:06.357061','2026-08-29 00:28:06.357065');
CREATE TABLE productos (
	id VARCHAR(36) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	slug VARCHAR(100), 
	description TEXT, 
	price FLOAT, 
	cost_price FLOAT, 
	currency VARCHAR(10), 
	stock INTEGER, 
	category_id VARCHAR(36), 
	brand_id VARCHAR(36), 
	image_url VARCHAR(255), 
	is_active BOOLEAN, 
	is_featured BOOLEAN, 
	is_global BOOLEAN, 
	sku VARCHAR(50), 
	barcode VARCHAR(50), 
	tenant_id VARCHAR(36), 
	branch_id VARCHAR(36), 
	is_synced BOOLEAN, 
	is_dirty BOOLEAN, 
	deleted_at DATETIME, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	UNIQUE (slug), 
	FOREIGN KEY(category_id) REFERENCES categories (id), 
	FOREIGN KEY(brand_id) REFERENCES brands (id)
);
INSERT INTO "productos" VALUES('95b2f4ed-8178-4d9a-89e9-b44f5bc76fbc','Display iPhone 12 Pro',NULL,NULL,75000.0,0.0,'ARS',5,NULL,NULL,NULL,1,0,0,NULL,NULL,NULL,NULL,0,1,NULL,'2026-08-28 04:22:49.919455','2026-08-28 04:22:49.919458');
CREATE TABLE servicios_tecnicos (
	id VARCHAR(36) NOT NULL, 
	client_id VARCHAR(36) NOT NULL, 
	device_id VARCHAR(36), 
	tenant_id VARCHAR(36), 
	branch_id VARCHAR(36), 
	falla VARCHAR(255), 
	estado_id INTEGER, 
	precio_presupuesto FLOAT, 
	observaciones TEXT, 
	is_synced BOOLEAN, 
	is_dirty BOOLEAN, 
	deleted_at DATETIME, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(client_id) REFERENCES clientes (id)
);
COMMIT;
