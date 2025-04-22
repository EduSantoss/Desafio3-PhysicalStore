# 📦 Physical-Store API

O projeto é um update do anterior, agora criando um sistema completo, uma API desenvolvida em **NestJS** para cadastro, geolocalização e exibição de lojas com base em um **CEP informado pelo cliente**. A aplicação integra múltiplos serviços externos para oferecer uma experiência completa de localização e entrega:

- Consulta de endereço com **ViaCEP**
- Cálculo de distância com **Google Maps Distance Matrix**
- Cotação de frete com **Melhor Envio API**

---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — Framework Node.js com suporte a TypeScript
- [MongoDB](https://www.mongodb.com/) — Banco de dados NoSQL
- [Mongoose](https://mongoosejs.com/) — ODM para MongoDB
- [Axios](https://axios-http.com/) — Cliente HTTP para requisições externas
- [Google Maps Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix) — Cálculo de distâncias
- [ViaCEP](https://viacep.com.br/) — API gratuita de consulta de endereços por CEP
- [Melhor Envio API](https://www.melhorenvio.com.br/) — Integração com transportadoras brasileiras
- [dotenv](https://www.npmjs.com/package/dotenv) — Carregamento de variáveis de ambiente

---

## 📌 Funcionalidades

- 🏪 **Cadastro de lojas por CEP**
  - Busca automática de endereço via ViaCEP
  - Conversão de endereço em coordenadas geográficas (latitude/longitude) usando Google Maps

- 🔎 **Listagem e busca de lojas**
  - Buscar todas as lojas
  - Buscar por estado (UF)
  - Buscar por ID

- 📍 **Localização de lojas próximas**
  - Baseada no CEP do cliente
  - Cálculo da distância via Google Maps
  - Identificação automática se é uma loja física (PDV) ou loja online
  - Ordenação das lojas por distância

- 🚚 **Cálculo de frete**
  - Frete fixo para lojas físicas próximas (até 50km)
  - Cotação de frete via Melhor Envio para distâncias superiores
  - Exibe opções como PAC e Sedex com prazos e preços

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
GOOGLE_MAPS_API_KEY=your_google_api_key
MELHOR_ENVIO_API_KEY=your_melhor_envio_api_key
```

---

## 🧪 Testes

O projeto utiliza **Jest** para testes unitários. Para rodar os testes:

```bash
npm run test
```

Para verificar a cobertura dos testes:

```bash
npm run test:cov
```

---

## ▶️ Executando o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nestjs-store-locator.git
cd physical-store
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
# edite o .env com suas chaves reais
```

### 4. Execute a aplicação

```bash
npm run start:dev
```

---


