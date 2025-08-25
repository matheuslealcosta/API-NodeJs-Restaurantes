# Use Node.js oficial com Alpine para menor tamanho
FROM node:18-alpine AS base

# Instala dependências necessárias
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./
COPY yarn.lock* ./
COPY prisma ./prisma/

# Instala dependências
RUN npm ci --only=production && npm cache clean --force

# Gera o cliente Prisma
RUN npx prisma generate

# ===== DESENVOLVIMENTO =====
FROM base AS development

# Instala dependências de desenvolvimento
RUN npm ci

# Copia código fonte
COPY . .

# Compila TypeScript
RUN npm run build

EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev"]

# ===== PRODUÇÃO =====
FROM base AS production

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copia código compilado
COPY --from=development --chown=nodejs:nodejs /app/dist ./dist
COPY --from=development --chown=nodejs:nodejs /app/package*.json ./

# Cria pasta de logs com permissão para o usuário nodejs
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

# Muda para usuário não-root
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

# Comando para produção
CMD ["node", "dist/server.js"]
