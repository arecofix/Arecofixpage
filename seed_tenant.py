import psycopg2

DB_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

def seed_tenant():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO public.tenants (id, name, slug, custom_domain, is_active)
            VALUES ('00000000-0000-0000-0000-000000000000', 'Arecofix Local', 'arecofix', 'localhost', true)
            ON CONFLICT (id) DO NOTHING;
        """)
        conn.commit()
        print("Tenant por defecto creado exitosamente.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    seed_tenant()
