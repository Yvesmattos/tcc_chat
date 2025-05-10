from ..models.chat import Chat
import json
import numpy as np
from sentence_transformers import SentenceTransformer, util
import os
import string

class ChatService:
    
    def __init__(self):
        # Caminho para o modelo treinado localmente
        chat = Chat('paraphrase-MiniLM-L6-v2')
        self.model = SentenceTransformer(chat.engine_name)

    def normalizar_texto(self, texto):
        texto = texto.strip().lower()
        texto = texto.translate(str.maketrans('', '', string.punctuation))
        return texto

    def get_resposta(self, pergunta_usuario):
        with open("C:/Users/ymattos/Desktop/tcc_chat_real/backend-ia-py/app/files/faq_multiplas_perguntas.json", 'r', encoding='utf-8') as f:
            faq = json.load(f)
        
        qa_pairs = [(self.normalizar_texto(question), answer) for question, answer in faq.items()]
        
        pergunta_usuario = self.normalizar_texto(pergunta_usuario)
        question_embeddings = self.model.encode([q for q, _ in qa_pairs])
        input_embedding = self.model.encode(pergunta_usuario)
        
        similarities = util.pytorch_cos_sim(input_embedding, question_embeddings)[0].numpy()

        sorted_indices = np.argsort(similarities)[::-1]
        top_3_indices = sorted_indices[:3]

        top_3_res = []
        for idx in top_3_indices:
            similarity = similarities[idx].item()
            result = {
                "pergunta_base": qa_pairs[idx][0],
                "resposta": qa_pairs[idx][1],
                "similaridade_maxima": similarity
            }
            print("\n\n")
            print(result)
            print("\n\n")
            top_3_res.append(result)

        return top_3_res
