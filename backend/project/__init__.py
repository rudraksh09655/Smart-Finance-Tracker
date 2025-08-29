# project/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
import os

db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()
app = Flask(__name__)

def create_app():
    CORS(app)
    app.config['SECRET_KEY'] = 'a_super_secret_key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../db.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db) # Initialize Flask-Migrate

    from .auth import auth_bp
    from .routes import main_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(main_bp, url_prefix='/api')

    return app