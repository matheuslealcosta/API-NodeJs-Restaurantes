# Makefile para API Restaurantes
# Facilita a execução de comandos comuns

.PHONY: help install dev build start test docker-up docker-down clean

# Variáveis
DOCKER_COMPOSE = docker-compose
NODE_ENV = development

help: ## Mostra esta mensagem de ajuda
	@echo "🍕 API Restaurantes - Comandos Disponíveis:"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""

install: ## Instala as dependências do projeto
	@echo "📦 Instalando dependências..."
	npm install

dev: ## Inicia o servidor em modo desenvolvimento
	@echo "🚀 Iniciando servidor em modo desenvolvimento..."
	npm run dev

build: ## Compila o projeto para produção
	@echo "🔨 Compilando projeto..."
	npm run build

start: ## Inicia o servidor em modo produção
	@echo "▶️  Iniciando servidor..."
	npm start

test: ## Executa os testes
	@echo "🧪 Executando testes..."
	npm test

test-watch: ## Executa os testes em modo watch
	@echo "👀 Executando testes em modo watch..."
	npm run test:watch

test-coverage: ## Executa os testes com coverage
	@echo "📊 Executando testes com coverage..."
	npm run test:coverage

lint: ## Executa o linter
	@echo "🔍 Executando linter..."
	npm run lint

lint-fix: ## Corrige problemas do linter automaticamente
	@echo "🔧 Corrigindo problemas do linter..."
	npm run lint:fix

# === DOCKER ===

docker-up: ## Sobe o ambiente Docker completo
	@echo "🐳 Subindo ambiente Docker..."
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Ambiente Docker iniciado!"
	@echo "📍 API: http://localhost:3000"
	@echo "📚 Docs: http://localhost:3000/api-docs"
	@echo "🗄️  pgAdmin: http://localhost:5050"

docker-down: ## Para o ambiente Docker
	@echo "⬇️  Parando ambiente Docker..."
	$(DOCKER_COMPOSE) down
	@echo "✅ Ambiente Docker parado!"

docker-dev: ## Sobe o ambiente Docker para desenvolvimento
	@echo "🐳 Subindo ambiente Docker (desenvolvimento)..."
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml up -d
	@echo "✅ Ambiente de desenvolvimento iniciado!"

docker-logs: ## Visualiza os logs do container da API
	@echo "📋 Logs da API:"
	$(DOCKER_COMPOSE) logs -f api

docker-build: ## Faz rebuild da imagem Docker
	@echo "🔨 Fazendo rebuild da imagem..."
	$(DOCKER_COMPOSE) up --build -d

docker-restart: ## Reinicia apenas o container da API
	@echo "🔄 Reiniciando API..."
	$(DOCKER_COMPOSE) restart api

docker-clean: ## Remove containers, volumes e imagens
	@echo "🧹 Limpando Docker..."
	$(DOCKER_COMPOSE) down -v --rmi all
	docker system prune -f
	@echo "✅ Docker limpo!"

# === DATABASE ===

db-generate: ## Gera o cliente Prisma
	@echo "⚙️  Gerando cliente Prisma..."
	npx prisma generate

db-push: ## Aplica o schema ao banco
	@echo "📤 Aplicando schema ao banco..."
	npx prisma db push

db-migrate: ## Executa migrações
	@echo "🗂️  Executando migrações..."
	npx prisma migrate dev

db-migrate-prod: ## Executa migrações em produção
	@echo "🗂️  Executando migrações (produção)..."
	npx prisma migrate deploy

db-studio: ## Abre o Prisma Studio
	@echo "🎨 Abrindo Prisma Studio..."
	npx prisma studio

db-seed: ## Popula o banco com dados de exemplo
	@echo "🌱 Populando banco com dados de exemplo..."
	npm run db:seed

db-reset: ## Reseta o banco de dados
	@echo "🔄 Resetando banco de dados..."
	npx prisma migrate reset --force
	@echo "✅ Banco resetado!"

# === SETUP ===

setup: install db-generate db-push db-seed ## Configuração inicial completa do projeto
	@echo ""
	@echo "🎉 Setup concluído com sucesso!"
	@echo ""
	@echo "🚀 Próximos passos:"
	@echo "  1. make docker-up    # Para subir com Docker"
	@echo "  2. make dev          # Para desenvolvimento local"
	@echo ""
	@echo "📍 URLs importantes:"
	@echo "  • API: http://localhost:3000"
	@echo "  • Docs: http://localhost:3000/api-docs"
	@echo "  • Health: http://localhost:3000/health"
	@echo ""

setup-docker: ## Setup inicial com Docker
	@echo "🐳 Configurando projeto com Docker..."
	make docker-up
	sleep 10
	$(DOCKER_COMPOSE) exec api npm run db:push
	$(DOCKER_COMPOSE) exec api npm run db:seed
	@echo ""
	@echo "🎉 Setup Docker concluído!"
	@echo "📍 API: http://localhost:3000"
	@echo "📚 Docs: http://localhost:3000/api-docs"

# === UTILS ===

clean: ## Remove arquivos temporários e builds
	@echo "🧹 Limpando arquivos temporários..."
	rm -rf dist/
	rm -rf coverage/
	rm -rf node_modules/.cache/
	rm -rf logs/
	@echo "✅ Limpeza concluída!"

info: ## Mostra informações do ambiente
	@echo "ℹ️  Informações do ambiente:"
	@echo "  Node.js: $(shell node --version)"
	@echo "  NPM: $(shell npm --version)"
	@echo "  Docker: $(shell docker --version 2>/dev/null || echo 'Não instalado')"
	@echo "  Sistema: $(shell uname -s)"
	@echo "  Diretório: $(shell pwd)"

status: ## Mostra status dos containers
	@echo "📊 Status dos containers:"
	$(DOCKER_COMPOSE) ps

# Valores padrão
.DEFAULT_GOAL := help
