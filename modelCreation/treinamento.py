import pandas as pd
from transformers import BertTokenizer, BertForNextSentencePrediction, AdamW
import torch
from torch.utils.data import TensorDataset, DataLoader, RandomSampler
from tqdm import tqdm

# Carregar dados pré-processados do arquivo Excel
input_file = "modelCreation/dados_processados.xlsx"
df = pd.read_excel(input_file)

# Inicializar o tokenizador e o modelo BERT pré-treinado
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForNextSentencePrediction.from_pretrained('bert-base-uncased')

# Preparar os dados para o ajuste fino (fine-tuning)
input_ids = []
attention_masks = []
token_type_ids = []  # IDs de tipo de token para distinguir entre pergunta e resposta
labels = []  # Rótulos para o cálculo do loss

for idx, row in tqdm(df.iterrows(), total=len(df)):
    question = row['pergunta_processada']
    answer = row['resposta_processada']
    encoding = tokenizer.encode_plus(question, answer, max_length=256, truncation=True, padding='max_length', return_tensors='pt')

    input_ids.append(encoding['input_ids'])
    attention_masks.append(encoding['attention_mask'])
    token_type_ids.append(encoding['token_type_ids'])  # Adicionando IDs de tipo de token
    labels.append(torch.tensor([1]))  # Rótulo 1 para indicar que a segunda sentença é a continuação da primeira

input_ids = torch.cat(input_ids, dim=0)
attention_masks = torch.cat(attention_masks, dim=0)
token_type_ids = torch.cat(token_type_ids, dim=0)  # Concatenando IDs de tipo de token
labels = torch.cat(labels, dim=0)  # Concatenando rótulos

# Definir o tamanho do batch e criar os DataLoader
batch_size = 8
dataset = TensorDataset(input_ids, attention_masks, token_type_ids, labels)
dataloader = DataLoader(dataset, sampler=RandomSampler(dataset), batch_size=batch_size)

# Configurar o otimizador e o número de épocas
optimizer = AdamW(model.parameters(), lr=5e-5, weight_decay=0.01)
epochs = 3

# Ajuste fino do modelo
model.train()
for epoch in range(epochs):
    for batch in tqdm(dataloader, desc=f"Época {epoch+1}"):
        optimizer.zero_grad()
        input_ids, attention_mask, token_type_ids, labels = batch
        outputs = model(input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids, labels=labels)
        loss = outputs.loss
        loss.backward()
        optimizer.step()

# Salvar o modelo após o ajuste fino
output_model_dir = "modelCreation/fine_tuned_bert_for_next_sentence_prediction"
model.save_pretrained(output_model_dir)
tokenizer.save_pretrained(output_model_dir)
