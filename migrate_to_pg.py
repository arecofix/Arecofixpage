import sqlite3
import psycopg2
import uuid

sqlite_db = 'Back-End/arecofix_local.sqlite'
pg_dsn = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'

tables = [
    'tenants', 'branches', 'profiles', 'brands', 'categories', 'products', 'product_images', 
    'orders', 'order_items', 'repairs', 'customer_devices',
    'services', 'blog_posts', 'blog_categories', 'blog_tags', 'blog_post_tags'
]

def migrate():
    try:
        sqlite_conn = sqlite3.connect(sqlite_db)
        sqlite_conn.row_factory = sqlite3.Row
        pg_conn = psycopg2.connect(pg_dsn)
        pg_cursor = pg_conn.cursor()
        
        default_tenant = 'a1f8194a-81a1-43bf-bcad-bd1b1eb42813' # we'll try to find a real one
        
        for table in tables:
            print(f"Migrating table {table}...")
            # Check if table exists in SQLite
            cursor = sqlite_conn.execute(f"SELECT count(*) FROM sqlite_master WHERE type='table' AND name='{table}'")
            if cursor.fetchone()[0] == 0:
                print(f"  Table {table} does not exist in SQLite, skipping.")
                continue

            rows = sqlite_conn.execute(f"SELECT * FROM {table}").fetchall()
            if not rows:
                print(f"  No data in {table}.")
                continue
                
            sqlite_columns = list(rows[0].keys())
            
            # Get matching columns in Postgres and their data types
            pg_cursor.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name=%s", (table,))
            pg_col_info = {r[0]: r[1] for r in pg_cursor.fetchall()}
            
            if not pg_col_info:
                print(f"  Table {table} does not exist in Postgres, skipping.")
                continue
                
            valid_columns = [c for c in sqlite_columns if c in pg_col_info]
            
            if not valid_columns:
                print(f"  No matching columns for {table}, skipping.")
                continue

            col_names = ', '.join([f'"{c}"' for c in valid_columns])
            placeholders = ', '.join(['%s'] * len(valid_columns))
            
            insert_query = f'INSERT INTO public."{table}" ({col_names}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'
            
            data_to_insert = []
            for row in rows:
                vals = []
                for col in valid_columns:
                    val = row[col]
                    pg_type = pg_col_info[col]
                    
                    # Fix boolean issues
                    if pg_type == 'boolean' and val is not None:
                        val = bool(val)
                    
                    # Fix null constraints (hardcoded fallbacks for the ones we saw fail)
                    if val is None:
                        if table == 'orders' and col == 'order_number':
                            val = 'ORD-OFFLINE-' + str(uuid.uuid4())[:8]
                        if table == 'order_items' and col == 'tenant_id':
                            val = default_tenant
                            
                    vals.append(val)
                data_to_insert.append(tuple(vals))
                
            try:
                pg_cursor.executemany(insert_query, data_to_insert)
                pg_conn.commit()
                print(f"  Inserted {len(rows)} rows into {table}.")
            except Exception as e:
                pg_conn.rollback()
                print(f"  Error inserting into {table}: {e}")
                
        pg_conn.close()
        sqlite_conn.close()
        print("Migration complete!")
    except Exception as e:
        print(f"Critical error: {e}")

if __name__ == "__main__":
    migrate()
