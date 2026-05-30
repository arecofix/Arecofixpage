from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
db_path = os.path.join(os.environ['APPDATA'], 'Arecofix', 'arecofix_local.sqlite')
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
db = SQLAlchemy(app)
with app.app_context():
    from sqlalchemy import text
    print(db.session.execute(text('SELECT username FROM admins')).fetchall())
