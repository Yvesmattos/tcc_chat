from ..models.chat import Chat
import json
import numpy as np
from sentence_transformers import SentenceTransformer,util

class ChatService:
    
    def __init__(self):
        chat = Chat('paraphrase-MiniLM-L6-v2')
        self.model = SentenceTransformer(chat.engine_name)

    def get_resposta(self, pergunta_usuario):
        with open("C:/Users/ymattos/OneDrive/Área de Trabalho/yves/meus docs/TCC ADS/projeto-tcc/tcc_chat/backend/app/files/data.json", 'r', encoding='utf-8') as f:
            faq = json.load(f)
        qa_pairs = [(question, answer) for question, answer in faq.items()]
        question_embeddings = self.model.encode([q for q, a in qa_pairs])
        input_embedding = self.model.encode(pergunta_usuario)
        similarities = util.pytorch_cos_sim(input_embedding, question_embeddings)[0]
        best_match_idx = np.argmax(similarities)
        max_similarity = similarities[best_match_idx].item()
        return {"pergunta_base": qa_pairs[best_match_idx][0],"resposta": qa_pairs[best_match_idx][1],"similaridade_maxima": max_similarity}