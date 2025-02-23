from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Permitir CORS para todas as rotas
    CORS(app, resources={r"/chat/*": {"origins": "*"}})  # Permite CORS para as rotas /chat/*
    
    app.config['CORS_HEADERS'] = 'Content-Type'

    # Registrar Blueprints
    from .controllers.chat_controller import chat_bp
    app.register_blueprint(chat_bp, url_prefix='/chat')

    return app
