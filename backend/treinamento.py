import json
import os
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader

# Carregar o modelo pré-treinado
model = SentenceTransformer('C:/Users/pizza/Desktop/ProjetosPython/tcc_chat/backend/2024_06_05_v1')

# Carregar dados de treinamento a partir de um arquivo JSON
with open('C:/Users/pizza/Desktop/ProjetosPython/tcc_chat/backend/treinamento_perguntas.json', 'r', encoding='utf-8') as f:
    treinamento_perguntas = json.load(f)

# Preparar exemplos para treinamento
train_examples = []

for item in treinamento_perguntas:
    perguntas = item['perguntas']
    # label = float(item['label'])
    
    # Comparar a pergunta1 com as outras perguntas
    pergunta1 = perguntas[0]
    for i in range(1, len(perguntas)):
        train_examples.append(InputExample(texts=[pergunta1, perguntas[i]], label=0.0))

# Criar um DataLoader para o treinamento
train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=2)

# Definir a loss function
train_loss = losses.CosineSimilarityLoss(model)

# Treinar o modelo
num_epochs = 4
model.fit(train_objectives=[(train_dataloader, train_loss)], epochs=num_epochs, warmup_steps=100)

# Diretório para salvar o modelo treinado
output_dir = 'C:/Users/pizza/Desktop/ProjetosPython/tcc_chat/backend/2024_06_06_v2'

# Verificar se o diretório existe, caso contrário, criá-lo
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Salvar o modelo treinado
model.save(output_dir)

print(f"Modelo treinado e salvo no diretório '{output_dir}'.")