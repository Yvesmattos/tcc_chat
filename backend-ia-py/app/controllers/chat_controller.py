from flask import Blueprint, jsonify, request
from ..services.chat_service import ChatService
from flask_cors import cross_origin

chat_bp = Blueprint('chat', __name__)

@cross_origin()
@chat_bp.route('/', methods=['GET'])
def index():
    return jsonify([])

@chat_bp.route('/send_question', methods=['POST'])
def send_question():
    parametros = request.get_json()
    chat = ChatService()
    resultado = chat.get_resposta(parametros['pergunta'])
    return jsonify(resultado), 201
