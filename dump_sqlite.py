import sqlite3
import sys

def dump_db(db_path, dump_path):
    conn = sqlite3.connect(db_path)
    with open(dump_path, 'w', encoding='utf-8') as f:
        for line in conn.iterdump():
            # D1 doesn't support BEGIN TRANSACTION / COMMIT if it's already wrapping it, but it usually accepts it.
            # D1 also uses slightly different syntax sometimes, but standard sqlite dump is mostly fine.
            f.write('%s\n' % line)
    conn.close()

if __name__ == '__main__':
    dump_db('Back-End/arecofix_local.sqlite', 'd1_dump.sql')
    print('Dumped successfully.')
