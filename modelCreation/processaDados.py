import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
import os

# Download de recursos necessários do NLTK
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Função para pré-processamento de texto
def preprocess_text(text):
    # Tokenização
    tokens = word_tokenize(text)
    # Remoção de pontuação
    tokens = [word for word in tokens if word.isalnum()]
    # Conversão para minúsculas
    tokens = [word.lower() for word in tokens]
    # Remoção de stopwords
    stop_words = set(stopwords.words('portuguese'))
    tokens = [word for word in tokens if not word in stop_words]
    # Lematização
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    # Junção dos tokens de volta em texto
    preprocessed_text = ' '.join(tokens)
    return preprocessed_text

# Ler os dados do arquivo Excel
input_file = os.path.join('modelCreation', 'dados_brutos.xlsx')
output_file = os.path.join('modelCreation', 'dados_processados.xlsx')

# Verificar se o arquivo de entrada existe
if os.path.exists(input_file):
    # Ler o arquivo Excel especificando o nome das colunas
    df = pd.read_excel(input_file, names=['pergunta', 'resposta'])
    
    # Aplicar pré-processamento às perguntas e respostas
    df['pergunta_processada'] = df['pergunta'].apply(preprocess_text)
    df['resposta_processada'] = df['resposta'].apply(preprocess_text)

    # Salvar DataFrame com dados pré-processados em um novo arquivo Excel
    df.to_excel(output_file, index=False)

    print(f"Dados pré-processados salvos em {output_file}")
else:
    print(f"O arquivo Excel '{input_file}' não foi encontrado.")
