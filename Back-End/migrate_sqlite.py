import sqlite3

def migrate():
    conn = sqlite3.connect('arecofix_local.sqlite')
    c = conn.cursor()
    
    try:
        c.execute('ALTER TABLE admins ADD COLUMN branch_id VARCHAR(36)')
    except sqlite3.OperationalError:
        pass # Column might already exist
        
    try:
        c.execute('ALTER TABLE admins ADD COLUMN role VARCHAR(20) DEFAULT "admin"')
    except sqlite3.OperationalError:
        pass

    # Update zaona user
    c.execute('''
        UPDATE admins
        SET branch_id = 'ae0776b7-2034-4baf-acf3-a9dab87a1e51', role = 'admin'
        WHERE username = 'zaona@arecofix.com.ar'
    ''')
    
    conn.commit()
    conn.close()
    print("Migration and update complete.")

if __name__ == '__main__':
    migrate()
