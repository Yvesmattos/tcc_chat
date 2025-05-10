import json
import os
import sys
import torch
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader

# Verificar se há GPU disponível
device = "cuda" if torch.cuda.is_available() else "cpu"

# Caminho para o modelo base
modelo_path = os.path.join("app", "modelos", "model2")
model = SentenceTransformer(modelo_path, device=device)

# Caminho para os dados de treinamento
diretorio_atual = os.path.dirname(__file__)
caminho_arquivo = os.path.join(diretorio_atual, 'base_treinamento.json')

# Carregar dados de treinamento
with open(caminho_arquivo, 'r', encoding='utf-8') as f:
    treinamento_perguntas = json.load(f)

# Preparar os exemplos de treinamento
train_examples = []
for item in treinamento_perguntas:
    pergunta = item.get('pergunta')
    comparar = item.get('comparar', [])
    
    for similar_text, score in comparar:
        # Verificar se o score está entre 0 e 1
        if 0 <= score <= 1:
            train_examples.append(InputExample(texts=[pergunta, similar_text], label=score))

# Criar DataLoader
train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=2)

# Definir função de perda
train_loss = losses.CosineSimilarityLoss(model)

# Treinar o modelo
model.fit(
    train_objectives=[(train_dataloader, train_loss)],
    epochs=50,
    warmup_steps=5,
    show_progress_bar=True
)

# Caminho para salvar o novo modelo treinado
base_dir = os.path.dirname(diretorio_atual)
output_dir = os.path.normpath(os.path.join(base_dir, "modelos/model3"))

# Criar diretório se não existir
os.makedirs(output_dir, exist_ok=True)

# Salvar modelo treinado
model.save(output_dir)

print(f"Modelo treinado e salvo no diretório '{output_dir}'.")
