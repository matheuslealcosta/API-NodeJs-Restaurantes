# 🍕 API Restaurantes - Sistema de Gestão de Pedidos

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.x-blue?style=for-the-badge&logo=typescript)
![Express.js](https://img.shields.io/badge/Express.js-4.18.x-black?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-4.11.x-2D3748?style=for-the-badge&logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Latest-blue?style=for-the-badge&logo=docker)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-API_Docs-green?style=for-the-badge&logo=swagger)

**Uma API RESTful moderna e robusta para gerenciamento de restaurantes, produtos e pedidos**

[🚀 Demo](#demo) • [📚 Documentação](#documentação) • [⚡ Quick Start](#quick-start) • [🐳 Docker](#docker) • [📖 API Reference](#api-reference)

</div>

---

## 🌟 Visão Geral

A **API Restaurantes** é uma solução completa e profissional para gerenciamento de sistemas de delivery e restaurantes. Construída com as melhores práticas e tecnologias modernas, oferece um conjunto robusto de funcionalidades para:

- 🏪 **Gestão de Restaurantes**: CRUD completo com validações
- 🍔 **Catálogo de Produtos**: Organização por categorias
- 📋 **Sistema de Pedidos**: Controle total do fluxo de pedidos
- 🔐 **Autenticação JWT**: Segurança robusta com tokens
- 📊 **Documentação Swagger**: API documentada e testável
- 🐳 **Docker Ready**: Deploy simplificado em qualquer ambiente

## ✨ Features Principais

### 🎯 Core Features
- ✅ **API RESTful** seguindo padrões REST
- ✅ **Autenticação JWT** com middleware de segurança
- ✅ **Validação de dados** com tratamento de erros
- ✅ **Relacionamentos complexos** entre entidades
- ✅ **Documentação Swagger** interativa
- ✅ **TypeScript** para type safety
- ✅ **Prisma ORM** para queries otimizadas

### 🚀 DevOps & Deploy
- ✅ **Docker Compose** para ambiente completo
- ✅ **PostgreSQL** containerizado
- ✅ **Hot reload** para desenvolvimento
- ✅ **Environment configs** flexíveis
- ✅ **Health checks** e monitoring
- ✅ **Production ready** com otimizações

### 🔒 Segurança
- ✅ **JWT Authentication** com expiração
- ✅ **Password hashing** com bcrypt
- ✅ **Rate limiting** configurado
- ✅ **CORS** configurado
- ✅ **Helmet** para headers de segurança
- ✅ **Validação de inputs** com Zod

## ⚡ Quick Start

### Pré-requisitos
- **Node.js** 18.x ou superior
- **Docker & Docker Compose**
- **Git**

### 🚀 Instalação Rápida (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/matheuslealcosta/API-NodeJs-Restaurantes.git
cd API-NodeJs-Restaurantes

# 2. Inicie com Docker (inclui banco de dados)
make docker-up
# ou: docker-compose up -d

# 3. Acesse a API
echo "🎉 API rodando em: http://localhost:3000"
echo "📚 Documentação: http://localhost:3000/api-docs"
```

### 🛠️ Instalação Manual

```bash
# 1. Clone e instale dependências
git clone https://github.com/matheuslealcosta/API-NodeJs-Restaurantes.git
cd API-NodeJs-Restaurantes
make install
# ou: npm install

# 2. Configure o ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Configure o banco
make db-generate db-push db-seed
# ou: npm run db:generate && npm run db:push && npm run db:seed

# 4. Inicie o servidor
make dev
# ou: npm run dev
```

### 🎯 Setup Completo com um Comando

```bash
# Setup inicial completo
make setup-docker  # Com Docker
# ou
make setup         # Sem Docker
```

## 🐳 Docker

### Arquivos de Configuração

O projeto inclui configuração Docker completa:

- **Dockerfile**: Image otimizada da aplicação
- **docker-compose.yml**: Orchestração completa com PostgreSQL
- **docker-compose.dev.yml**: Ambiente de desenvolvimento

### Comandos Docker

```bash
# Ambiente completo (produção)
make docker-up
# ou: docker-compose up -d

# Ambiente de desenvolvimento
make docker-dev
# ou: docker-compose -f docker-compose.dev.yml up -d

# Ver logs
make docker-logs
# ou: docker-compose logs -f api

# Rebuild da aplicação
make docker-build
# ou: docker-compose up --build

# Parar tudo
make docker-down
# ou: docker-compose down

# Limpar volumes (⚠️ apaga dados)
make docker-clean
# ou: docker-compose down -v
```

## 📖 API Reference

### 🔐 Autenticação

Todas as rotas (exceto registro e login) requerem autenticação Bearer Token:

```bash
Authorization: Bearer <seu-jwt-token>
```

### 📋 Endpoints Principais

#### 🔑 Autenticação
```http
POST   /api/v1/auth/login           # Login do restaurante
POST   /api/v1/auth/refresh         # Refresh do token
POST   /api/v1/auth/logout          # Logout
```

#### 🏪 Restaurantes
```http
GET    /api/v1/restaurantes         # Listar todos (com paginação)
GET    /api/v1/restaurantes/:id     # Buscar por ID
GET    /api/v1/restaurantes/:id/stats # Estatísticas
POST   /api/v1/restaurantes         # Criar novo
PUT    /api/v1/restaurantes/:id     # Atualizar
DELETE /api/v1/restaurantes/:id     # Deletar
```

#### 🍔 Produtos
```http
GET    /api/v1/produtos             # Listar todos
GET    /api/v1/produtos/:id         # Buscar por ID
GET    /api/v1/restaurantes/:id/produtos # Produtos do restaurante
POST   /api/v1/produtos/:restauranteId   # Criar novo
PUT    /api/v1/produtos/:id         # Atualizar
DELETE /api/v1/produtos/:id         # Deletar
```

#### 📋 Pedidos
```http
GET    /api/v1/pedidos              # Listar todos
GET    /api/v1/pedidos/:id          # Buscar por ID
GET    /api/v1/restaurantes/:id/pedidos # Pedidos do restaurante
POST   /api/v1/pedidos/:restauranteId   # Criar novo
PUT    /api/v1/pedidos/:id          # Atualizar
DELETE /api/v1/pedidos/:id          # Deletar
```

### 💡 Exemplos de Uso

#### Criar Restaurante
```bash
curl -X POST http://localhost:3000/api/v1/restaurantes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pizzaria do João",
    "email": "contato@pizzariadojoao.com",
    "senha": "123456",
    "categoria": "Pizzaria",
    "cidade": "São Paulo",
    "endereco": "Rua das Flores, 123",
    "telefone": "+5511999999999"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contato@pizzariadojoao.com",
    "senha": "123456"
  }'
```

#### Criar Produto
```bash
curl -X POST http://localhost:3000/api/v1/produtos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "nome": "Pizza Margherita",
    "descricao": "Pizza clássica com molho, muçarela e manjericão",
    "quantidade": "1",
    "preco": "29.90",
    "categoria": "Pizza"
  }'
```

## 📚 Documentação

### 🎯 Swagger/OpenAPI
Acesse a documentação interativa em: **http://localhost:3000/api-docs**

A documentação inclui:
- 📝 Descrição detalhada de cada endpoint
- 🧪 Interface para testar as APIs
- 📋 Modelos de dados e schemas
- 🔐 Configuração de autenticação
- ✅ Códigos de resposta e exemplos

### 🗂️ Estrutura do Projeto

```
API-NodeJs-Restaurantes/
├── 📁 src/
│   ├── 📁 controllers/          # Controllers da aplicação
│   │   ├── LoginController.ts
│   │   ├── RestauranteController.ts
│   │   ├── ProdutosController.ts
│   │   └── PedidosController.ts
│   ├── 📁 routes/              # Definição das rotas
│   │   └── index.ts
│   ├── 📁 middleware/          # Middlewares personalizados
│   │   └── errorHandler.ts
│   ├── 📁 utils/              # Utilitários
│   │   └── logger.ts
│   ├── 📄 server.ts           # Servidor principal
│   └── 📄 swagger.json        # Documentação OpenAPI
├── 📁 prisma/                 # Configurações do Prisma
│   ├── 📄 schema.prisma       # Schema do banco
│   ├── 📄 seed.ts            # Dados de exemplo
│   └── 📁 migrations/         # Migrações
├── 📁 docker/                 # Configurações Docker
│   └── 📁 postgres/          # Scripts do PostgreSQL
├── 📄 Dockerfile              # Image da aplicação
├── 📄 docker-compose.yml      # Orchestração
├── 📄 Makefile               # Comandos simplificados
├── 📄 package.json            # Dependências
├── 📄 tsconfig.json          # Config TypeScript
└── 📄 README.md              # Este arquivo
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
make dev          # Inicia servidor com hot-reload
make build        # Build para produção
make start        # Inicia servidor produção

# Database
make db-generate  # Gera cliente Prisma
make db-push      # Aplica schema ao banco
make db-migrate   # Executa migrações
make db-studio    # Interface visual do banco
make db-seed      # Popula dados de exemplo

# Docker
make docker-up    # Sobe ambiente Docker
make docker-down  # Para ambiente Docker
make docker-logs  # Visualiza logs

# Qualidade
make lint         # Executa linter
make test         # Executa testes
make test-watch   # Testes em modo watch

# Utilitários
make clean        # Limpa arquivos temporários
make help         # Mostra todos os comandos
```

## 🧪 Testes

```bash
# Executar todos os testes
make test

# Testes em modo watch
make test-watch

# Coverage
make test-coverage
```

## 🚀 Deploy

### Deploy com Docker

```bash
# Build da imagem
docker build -t api-restaurantes .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-secret" \
  api-restaurantes
```

### Deploy em Cloud Providers

O projeto está pronto para deploy em:
- **Heroku** (Procfile incluído)
- **Railway** (railway.json configurado)  
- **Vercel** (serverless ready)
- **DigitalOcean App Platform**
- **AWS ECS/Fargate**

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1h"

# Server
NODE_ENV="development"
PORT=3000

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

## 📊 Dados de Exemplo

O projeto inclui um seed com dados de exemplo:

- **5 restaurantes** de diferentes categorias
- **8 produtos** variados
- **3 pedidos** de exemplo

Execute: `make db-seed` ou `npm run db:seed`

**Login de teste:**
- Email: `contato@pizzariadomario.com`
- Senha: `123456`

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### 📋 Guidelines

- Siga o padrão de código existente
- Adicione testes para novas features
- Atualize a documentação quando necessário
- Use commits semânticos (feat, fix, docs, etc.)

## 📝 Licença

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Matheus Leal Costa**
- GitHub: [@matheuslealcosta](https://github.com/matheuslealcosta)
- Email: matheuslealcosta@icloud.com
- LinkedIn: [LinkedIn](https://linkedin.com/in/seu-perfil)

---

## 🎯 Roadmap

### 🔮 Próximas Features

- [ ] **Sistema de Avaliações** - Reviews e ratings
- [ ] **Notificações Push** - Atualizações em tempo real  
- [ ] **Relatórios e Analytics** - Dashboard gerencial
- [ ] **Sistema de Cupons** - Descontos e promoções
- [ ] **Integração Pagamento** - Stripe, PayPal, PIX
- [ ] **Geolocalização** - Rastreamento de entrega
- [ ] **API de Terceiros** - Integração com WhatsApp
- [ ] **Mobile App** - React Native / Flutter
- [ ] **Cache Redis** - Performance otimizada
- [ ] **Microservices** - Arquitetura escalável

### 🎨 Melhorias Técnicas

- [ ] **Testes Automatizados** - Coverage completa
- [ ] **CI/CD Pipeline** - GitHub Actions
- [ ] **Monitoring** - Logs e métricas avançados
- [ ] **Documentation** - Gitbook/Docusaurus
- [ ] **GraphQL** - Alternativa ao REST
- [ ] **WebSockets** - Real-time updates

---

<div align="center">

**⭐ Se este projeto te ajudou, considera dar uma estrela!**

**🚀 Happy Coding!**

</div>
