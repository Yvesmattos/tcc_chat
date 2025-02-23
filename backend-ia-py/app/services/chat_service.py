from ..models.chat import Chat
import json
import numpy as np
# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize
# from nltk.stem import WordNetLemmatizer
from sentence_transformers import SentenceTransformer, util
import os

class ChatService:
    
    def __init__(self):
        chat = Chat('paraphrase-MiniLM-L6-v2')
        self.model = SentenceTransformer(chat.engine_name)
        # self.stop_words = set(stopwords.words('portuguese'))
        # self.lemmatizer = WordNetLemmatizer()

    # def preprocess_text(self, text):
    #     tokens = word_tokenize(text.lower(), language='portuguese')
    #     tokens = [self.lemmatizer.lemmatize(token) for token in tokens if token.isalpha() and token not in self.stop_words]
    #     return ' '.join(tokens)

    def get_resposta(self, pergunta_usuario):
        with open("C:/Users/ymattos/Desktop/tcc_chat_real/backend-ia-py/app/files/faq.json", 'r', encoding='utf-8') as f:
        # with open("C:/Users/pizza/Desktop/ProjetosPython/tcc_chat/ia-backend/app/files/faq.json", 'r', encoding='utf-8') as f:
            faq = json.load(f)
        
        qa_pairs = [(question, answer) for question, answer in faq.items()]
        question_embeddings = self.model.encode([q for q, a in qa_pairs])
        input_embedding = self.model.encode(pergunta_usuario)
        similarities = util.pytorch_cos_sim(input_embedding, question_embeddings)[0].numpy()

        # Ordena as similaridades e pega os índices das 3 maiores
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
            top_3_res.append(result)
        return top_3_res
