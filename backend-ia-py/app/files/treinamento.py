import json
import os
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader
import os

# Carregar o modelo pré-treinado
# model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
diretorio_atual = os.path.dirname(__file__)
caminho_arquivo = os.path.join(diretorio_atual, 'treinamento_perguntas.json')

print(caminho_arquivo)
# Carregar dados de treinamento a partir de um arquivo JSON
with open(caminho_arquivo, 'r', encoding='utf-8') as f:
    treinamento_perguntas = json.load(f)

# Preparar exemplos para treinamento
train_examples = []

for item in treinamento_perguntas:
    perguntas = item['perguntas']
    label = float(item['label'])
    
    # Comparar a pergunta1 com as outras perguntas
    pergunta1 = perguntas[0]
    for i in range(1, len(perguntas)):
        train_examples.append(InputExample(texts=[pergunta1, perguntas[i]], label=label))

# Criar um DataLoader para o treinamento
train_dataloader = DataLoader(train_examples, shuffle=False, batch_size=2)

# Definir a loss function
train_loss = losses.CosineSimilarityLoss(model)

# Treinar o modelo
# 50 epochs = 5 warmup_steps
# 100 perguntas * 50 epochs = 5000 perguntas 
# 100 perguntas * 5 warmup_steps = 500 perguntas
# total de perguntas que serão contabilizadas 4500
# definir o warmup entre 5% a 10% do total de treinamento
model.fit(train_objectives=[(train_dataloader, train_loss)], epochs=50, warmup_steps=5)

# Diretório para salvar o modelo treinado

output_dir = os.getenv("FOLDER")+"backend/modelos/2024_06_14_v3"

# Verificar se o diretório existe, caso contrário, criá-lo
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Salvar o modelo treinado
model.save(output_dir)

print(f"Modelo treinado e salvo no diretório '{output_dir}'.")