import torch
import numpy as np
from sentence_transformers import SentenceTransformer, util

class RobertaEngine:
    def __init__(self):
        # model_name = 'C:/Users/pizza/Desktop/ProjetosPython/treinamento/paraphrase_faq_model'
        model_name = 'C:/Users/pizza/Desktop/ProjetosPython/TCC_CHAT/novo_model_treinado'
        # model_name = 'paraphrase-MiniLM-L6-v2'
        self.model = SentenceTransformer(model_name)

    def get_resposta(self, pergunta_usuario, faq):
        qa_pairs = [(question, answer) for question, answer in faq.items()]
        question_embeddings = self.model.encode([q for q, a in qa_pairs])
        input_embedding = self.model.encode(pergunta_usuario)
        similarities = util.pytorch_cos_sim(input_embedding, question_embeddings)[0]
        best_match_idx = np.argmax(similarities)
        max_similarity = similarities[best_match_idx].item()
        return {"pergunta_base": qa_pairs[best_match_idx][0],"resposta": qa_pairs[best_match_idx][1],"similaridade_maxima": max_similarity}
        