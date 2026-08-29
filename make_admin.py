import psycopg2

DB_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

def make_admin(email):
    try:
        print(f"Connecting to {DB_URL}...")
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Primero revisamos si el usuario existe
        cur.execute("SELECT id, role FROM public.profiles WHERE email = %s", (email,))
        user = cur.fetchone()
        
        if not user:
            print(f"ERROR: No se encontró el usuario con email {email} en public.profiles")
            return
            
        print(f"Usuario encontrado. Rol actual: {user[1]}")
        
        # Actualizamos el rol
        cur.execute("UPDATE public.profiles SET role = 'super_admin' WHERE email = %s", (email,))
        conn.commit()
        
        print("¡Éxito! Rol actualizado a 'super_admin'.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    make_admin('info@arecofix.com.ar')
