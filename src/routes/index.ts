import { Router } from "express";
const express = require('express');
import { RestauranteController } from "../controllers/RestauranteController";
import { ProdutoController } from "../controllers/ProdutosController";
import LoginController from "../controllers/LoginController";
import { PedidosController } from "../controllers/PedidosController";

const routes = express.Router();

routes.post('/login', LoginController.login);

routes.get('/pedidos',LoginController.verificaToken , PedidosController.getPedido);
routes.get('/pedidos/:id',LoginController.verificaToken , PedidosController.getPedidoById);
routes.post('/pedidos/:restauranteId',LoginController.verificaToken , PedidosController.createPedido);
routes.put('/pedidos/:id',LoginController.verificaToken , PedidosController.updatePedido);
routes.delete('/pedidos/:id',LoginController.verificaToken , PedidosController.deletePedido);

routes.get('/restaurantes',LoginController.verificaToken , RestauranteController.getRestaurantes);
routes.get('/restaurantes/:id',LoginController.verificaToken, RestauranteController.getRestauranteById);
routes.post('/restaurantes', RestauranteController.createRestaurante);
routes.put('/restaurantes/:id',LoginController.verificaToken, RestauranteController.updateRestaurante);
routes.delete('/restaurantes/:id',LoginController.verificaToken, RestauranteController.deleteRestaurante);



export { routes };
