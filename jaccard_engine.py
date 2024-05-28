from difflib import SequenceMatcher

class JaccardEngine:
    def encontrar_pergunta_similar(self, pergunta_usuario, faq):
        similaridade_maxima = 0.35
        pergunta_similar = None
        resposta = None

        for pergunta_faq, resposta_faq in faq.items():
            similaridade = SequenceMatcher(None, pergunta_usuario.lower(), pergunta_faq.lower()).ratio()
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
            return {"pergunta_base": None, "resposta": "Desculpe, não encontrei uma resposta para essa pergunta usando Jaccard.", "similaridade_maxima": similaridade_maxima}
