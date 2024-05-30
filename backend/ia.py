import json

class ResponseEngine:
    def __init__(self):
        self.bert_engine = None
        self.jaccard_engine = None
        self.roberta_engine = None

    def _initialize_engine(self, engine_type):
        if engine_type == 'bert':
            if self.bert_engine is None:
                from bert_engine import BertEngine
                self.bert_engine = BertEngine()
            return self.bert_engine

        elif engine_type == 'jaccard':
            if self.jaccard_engine is None:
                from jaccard_engine import JaccardEngine
                self.jaccard_engine = JaccardEngine()
            return self.jaccard_engine

        elif engine_type == 'roberta':
            if self.roberta_engine is None:
                from roberta_engine import RobertaEngine
                self.roberta_engine = RobertaEngine()
            return self.roberta_engine

        return None

    def get_resposta(self, pergunta_usuario, engine):
        with open("data.json", 'r', encoding='utf-8') as f:
            faq = json.load(f)

        res = {
            "data": {},
            "status": "ok"
        }

        if engine == 1:
            bert_engine = self._initialize_engine('bert')
            res["data"]["bert"] = bert_engine.get_resposta(pergunta_usuario, faq)
        elif engine == 2:
            jaccard_engine = self._initialize_engine('jaccard')
            res["data"]["jaccard"] = jaccard_engine.get_resposta(pergunta_usuario, faq)
        elif engine == 3:
            roberta_engine = self._initialize_engine('roberta')
            res["data"]["roberta"] = roberta_engine.get_resposta(pergunta_usuario, faq)
        else:
            bert_engine = self._initialize_engine('bert')
            jaccard_engine = self._initialize_engine('jaccard')
            res["data"]["bert"] = bert_engine.get_resposta(pergunta_usuario, faq)
            res["data"]["jaccard"] = jaccard_engine.get_resposta(pergunta_usuario, faq)

        return res
