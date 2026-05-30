from werkzeug.security import generate_password_hash
import sqlite3

def update_password():
    conn = sqlite3.connect('arecofix_local.sqlite')
    c = conn.cursor()
    
    hashed_pw = generate_password_hash("zaona2026")
    
    c.execute('''
        UPDATE admins
        SET password_hash = ?
        WHERE username = 'zaona@arecofix.com.ar'
    ''', (hashed_pw,))
    
    conn.commit()
    conn.close()
    print("Password updated for zaona@arecofix.com.ar to zaona2026")

if __name__ == '__main__':
    update_password()
