import json
from transformers import BertTokenizer, BertForNextSentencePrediction
import torch
from difflib import SequenceMatcher
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Carregar o modelo BERT pré-treinado e o tokenizador
model_name = 'bert-base-uncased'
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertForNextSentencePrediction.from_pretrained(model_name)

# FAQ - Atendimento ao Cliente
with open("data.json", "r") as f:
    # lendo e desserializando o conteúdo do arquivo
    faq = json.load(f)

# Função para encontrar a pergunta mais similar no FAQ considerando variações usando BERT
def encontrar_pergunta_similar_bert(pergunta_usuario, faq):
    similaridade_maxima = 0.3
    pergunta_similar = None
    resposta = None

    for pergunta_faq, resposta_faq in faq.items():
        # Preprocessar as perguntas para o formato adequado do BERT
        inputs = tokenizer.encode_plus(pergunta_usuario.lower(), pergunta_faq.lower(), return_tensors='pt', add_special_tokens=True)
        # Fazer a predição se a pergunta do usuário segue a pergunta do FAQ
        outputs = model(**inputs)
        logits = outputs.logits
        if torch.argmax(logits, dim=1) == torch.tensor(0):
            similaridade = logits[0][0].item()
            if similaridade > similaridade_maxima:
                similaridade_maxima = similaridade
                pergunta_similar = pergunta_faq
                resposta = resposta_faq

    return pergunta_similar, resposta

# Função para encontrar a pergunta mais similar no FAQ considerando variações usando Similaridade de Jaccard
def encontrar_pergunta_similar_jaccard(pergunta_usuario, faq):
    similaridade_maxima = 0.3
    pergunta_similar = None
    resposta = None

    for pergunta_faq, resposta_faq in faq.items():
        similaridade = SequenceMatcher(None, pergunta_usuario.lower(), pergunta_faq.lower()).ratio()
        if similaridade > similaridade_maxima:
            similaridade_maxima = similaridade
            pergunta_similar = pergunta_faq
            resposta = resposta_faq

    return pergunta_similar, resposta


# Receber a pergunta do usuário
pergunta_usuario = input("Você: ")

# Encontrar a pergunta mais similar no FAQ usando BERT
pergunta_similar_bert, resposta_bert = encontrar_pergunta_similar_bert(pergunta_usuario, faq)

# Encontrar a pergunta mais similar no FAQ usando Jaccard
pergunta_similar_jaccard, resposta_jaccard = encontrar_pergunta_similar_jaccard(pergunta_usuario, faq)

# Imprimir as respostas
if pergunta_similar_bert is not None:
    res_bert = "Usando BERT: " + resposta_bert
else:
    print("Bot: Desculpe, não encontrei uma resposta para essa pergunta usando BERT.")

if pergunta_similar_jaccard is not None:
    res_jaccard = "Usando Jaccard: " + resposta_jaccard
else:
    print("Bot: Desculpe, não encontrei uma resposta para essa pergunta usando Jaccard.")

res = {
    "data": res_bert,
    "status": "ok"
}