import { Router } from "express";
import { RestauranteController } from "../controllers/RestauranteController";
import { ProdutoController } from "../controllers/ProdutosController";
import LoginController from "../controllers/LoginController";
import { PedidosController } from "../controllers/PedidosController";

const routes = Router();

// ===== ROTAS DE AUTENTICAÇÃO =====
/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Endpoints de autenticação e autorização
 */
routes.post('/auth/login', LoginController.login);
routes.post('/auth/refresh', LoginController.verificaToken, LoginController.refreshToken);
routes.post('/auth/logout', LoginController.logout);

// ===== ROTAS DE RESTAURANTES =====
/**
 * @swagger
 * tags:
 *   - name: Restaurantes
 *     description: Gerenciamento de restaurantes
 */
routes.get('/restaurantes', LoginController.verificaToken, RestauranteController.getRestaurantes);
routes.get('/restaurantes/:id', LoginController.verificaToken, RestauranteController.getRestauranteById);
routes.get('/restaurantes/:id/stats', LoginController.verificaToken, RestauranteController.getRestauranteStats);
routes.post('/restaurantes', RestauranteController.createRestaurante); // Não requer autenticação (registro)
routes.put('/restaurantes/:id', LoginController.verificaToken, RestauranteController.updateRestaurante);
routes.delete('/restaurantes/:id', LoginController.verificaToken, RestauranteController.deleteRestaurante);

// ===== ROTAS DE PRODUTOS =====
/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: Gerenciamento de produtos dos restaurantes
 */
routes.get('/produtos', LoginController.verificaToken, ProdutoController.getProdutos);
routes.get('/produtos/:id', LoginController.verificaToken, ProdutoController.getProdutoById);
routes.get('/restaurantes/:restauranteId/produtos', LoginController.verificaToken, ProdutoController.getProdutosByRestaurante);
routes.post('/produtos/:restauranteId', LoginController.verificaToken, ProdutoController.createProduto);
routes.put('/produtos/:id', LoginController.verificaToken, ProdutoController.updateProduto);
routes.delete('/produtos/:id', LoginController.verificaToken, ProdutoController.deleteProduto);

// ===== ROTAS DE PEDIDOS =====
/**
 * @swagger
 * tags:
 *   - name: Pedidos
 *     description: Gerenciamento de pedidos dos restaurantes
 */
routes.get('/pedidos', LoginController.verificaToken, PedidosController.getPedido);
routes.get('/pedidos/:id', LoginController.verificaToken, PedidosController.getPedidoById);
routes.get('/restaurantes/:restauranteId/pedidos', LoginController.verificaToken, PedidosController.getPedidosByRestaurante);
routes.post('/pedidos/:restauranteId', LoginController.verificaToken, PedidosController.createPedido);
routes.put('/pedidos/:id', LoginController.verificaToken, PedidosController.updatePedido);
routes.delete('/pedidos/:id', LoginController.verificaToken, PedidosController.deletePedido);

// ===== ROTAS DE RELATÓRIOS E ANALYTICS =====
/**
 * @swagger
 * tags:
 *   - name: Relatórios
 *     description: Relatórios e estatísticas do sistema
 */
routes.get('/dashboard/stats', LoginController.verificaToken, async (req, res) => {
  // Implementação futura de dashboard geral
  res.json({
    status: 'success',
    message: 'Dashboard em desenvolvimento',
    data: {
      totalRestaurantes: 0,
      totalProdutos: 0,
      totalPedidos: 0,
    }
  });
});

// ===== ROTA DE HEALTH CHECK =====
routes.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===== ROTA DE INFORMAÇÕES DA API =====
routes.get('/', (req, res) => {
  res.json({
    name: 'API Restaurantes',
    version: '2.0.0',
    description: 'API RESTful para gerenciamento de restaurantes, produtos e pedidos',
    documentation: '/api-docs',
    health: '/api/v1/health',
    endpoints: {
      auth: '/api/v1/auth',
      restaurantes: '/api/v1/restaurantes',
      produtos: '/api/v1/produtos',
      pedidos: '/api/v1/pedidos',
    },
    author: 'Matheus Leal Costa',
  });
});

export { routes };
