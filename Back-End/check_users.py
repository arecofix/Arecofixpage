import sqlite3

def check_users():
    conn = sqlite3.connect('arecofix_local.sqlite')
    c = conn.cursor()
    c.execute('SELECT username, password_hash, branch_id, role FROM admins')
    rows = c.fetchall()
    print("Users in DB:", rows)
    conn.close()

if __name__ == '__main__':
    check_users()
