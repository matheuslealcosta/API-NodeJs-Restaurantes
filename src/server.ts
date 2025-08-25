import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { routes } from './routes';
import swaggerDocs from './swagger.json';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARES DE SEGURANÇA =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configurado
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas requisições do mesmo IP, tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Logging HTTP
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// ===== MIDDLEWARES DE PARSING =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// ===== DOCUMENTAÇÃO SWAGGER =====
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customSiteTitle: "API Restaurantes - Documentação",
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6 }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    tryItOutEnabled: true,
  },
}));

// ===== ROTAS PRINCIPAIS =====
app.use('/api/v1', routes);

// Rota raiz com informações da API
app.get('/', (req, res) => {
  res.json({
    name: 'API Restaurantes',
    version: '2.0.0',
    description: 'API RESTful para gerenciamento de restaurantes, produtos e pedidos',
    documentation: '/api-docs',
    health: '/health',
    author: 'Matheus Leal Costa',
    repository: 'https://github.com/matheuslealcosta/API-NodeJs-Restaurantes',
  });
});

// ===== MIDDLEWARE DE ERRO =====
app.use(errorHandler);

// ===== TRATAMENTO DE ROTAS NÃO ENCONTRADAS =====
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    message: `A rota ${req.method} ${req.originalUrl} não existe`,
    documentation: '/api-docs',
  });
});

// ===== TRATAMENTO DE ERROS NÃO CAPTURADOS =====
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// ===== GRACEFUL SHUTDOWN =====
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 30s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ===== INICIALIZAÇÃO DO SERVIDOR =====
const server = app.listen(PORT, () => {
  logger.info(`
🚀 Server is running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 URL: http://localhost:${PORT}
📚 Documentation: http://localhost:${PORT}/api-docs
🏥 Health Check: http://localhost:${PORT}/health
  `);
});

export default app;
