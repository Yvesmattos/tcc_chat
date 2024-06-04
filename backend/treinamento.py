from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader
import json
import os

# Carregar o modelo pré-treinado
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Carregar dados de FAQ a partir de um arquivo JSON
with open('C:/Users/pizza/Desktop/ProjetosPython/tcc_chat/backend/data.json', 'r', encoding='utf-8') as f:
    faq_data = json.load(f)

# Preparar exemplos para treinamento
train_examples = []

for question, answer in faq_data.items():
    # Usamos a pergunta e a resposta como exemplos de pares de frases que são semanticamente similares
    train_examples.append(InputExample(texts=[question, answer], label=0.9999))

# Criar um DataLoader para o treinamento
train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=2)

# Definir a loss function
train_loss = losses.CosineSimilarityLoss(model)

# Treinar o modelo
num_epochs = 4
model.fit(train_objectives=[(train_dataloader, train_loss)], epochs=num_epochs, warmup_steps=100)

# Diretório para salvar o modelo treinado
output_dir = 'novo_model_treinado'

# Verificar se o diretório existe, caso contrário, criá-lo
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Salvar o modelo treinado
model.save(output_dir)

print(f"Modelo treinado e salvo no diretório '{output_dir}'.")
