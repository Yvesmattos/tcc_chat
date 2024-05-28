import torch
from transformers import BertTokenizer, BertForNextSentencePrediction

class BertEngine:
    def __init__(self):
        model_name = 'bert-base-uncased'
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.model = BertForNextSentencePrediction.from_pretrained(model_name)

    def encontrar_pergunta_similar(self, pergunta_usuario, faq):
        similaridade_maxima = 0.3
        pergunta_similar = None
        resposta = None

        for pergunta_faq, resposta_faq in faq.items():
            inputs = self.tokenizer.encode_plus(pergunta_usuario.lower(), pergunta_faq.lower(), return_tensors='pt', add_special_tokens=True)
            outputs = self.model(**inputs)
            logits = outputs.logits
            if torch.argmax(logits, dim=1) == torch.tensor(0):
                similaridade = logits[0][0].item()
                if similaridade > similaridade_maxima:
                    similaridade_maxima = similaridade
                    pergunta_similar = pergunta_faq
                    resposta = resposta_faq

        return pergunta_similar, resposta, similaridade_maxima

    def get_resposta(self, pergunta_usuario, faq):
        pergunta_similar, resposta, similaridade_maxima = self.encontrar_pergunta_similar(pergunta_usuario, faq)
        if pergunta_similar is not None:
            return {"pergunta_base": pergunta_similar, "resposta": resposta, "similaridade_maxima": similaridade_maxima}
        else:
            return {"pergunta_base": None, "resposta": "Desculpe, não encontrei uma resposta para essa pergunta usando BERT.", "similaridade_maxima": similaridade_maxima}
