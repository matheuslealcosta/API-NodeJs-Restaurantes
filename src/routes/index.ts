import { Router } from "express";
const express = require('express');
import { RestauranteController } from "../controllers/RestauranteController";
import { ProdutoController } from "../controllers/ProdutosController";
import LoginController from "../controllers/LoginController";
import { PedidosController } from "../controllers/PedidosController";

const routes = express.Router();

routes.post('/login', LoginController.login);


export { routes };
