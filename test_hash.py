from werkzeug.security import check_password_hash
import sqlite3
import os
conn = sqlite3.connect(os.path.join(os.environ['APPDATA'], 'Arecofix', 'arecofix_local.sqlite'))
c = conn.cursor()
c.execute('SELECT password_hash FROM admins WHERE username=\"zaona@arecofix.com.ar\"')
hash_str = c.fetchone()[0]
print('Hash in DB:', hash_str)
print('Matches zaona2026?', check_password_hash(hash_str, 'zaona2026'))
