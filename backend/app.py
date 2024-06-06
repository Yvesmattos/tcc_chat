from flask import Flask, request, jsonify
from ia import ResponseEngine
from flask import Flask
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/send_question', methods=['POST'])
@cross_origin()
def create_item():
    parametros = request.get_json()
    engine = ResponseEngine()
    resultado = engine.get_resposta(parametros["pergunta"], int(parametros["engine"]))  # Engine 1 para BERT, 2 para Jaccard, 3 para ambos
    return jsonify(resultado), 201

if __name__ == '__main__':
    app.run(debug=True)

# padrão 0.5739443898200989
# mais perguntas mesmas respostas 0.769791841506958
# usando o modelo treinado com perguntas:perguntas 0.9320012927055359
