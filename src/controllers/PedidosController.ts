import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PedidosController {
  static createPedido = async (req: Request, res: Response) => {
    const {
      valor_total,
      nome_cliente,
      cidade_cliente,
      endereco_cliente,
      telefone_cliente,
      produtoId 
    } = req.body;
    const { restauranteId } = req.params;

    const restt = await prisma.restaurante.findUnique({
      where: {
        id: parseInt(restauranteId),
      },
    });

    if (!restt) {
      res
        .status(500)
        .json({
          message: `Restaurante com ID ${restauranteId} não encontrado.`,
        });
      return;
    }
    try {
      const pedido = await prisma.pedido.create({
        data: {
          valor_total,
          nome_cliente,
          cidade_cliente,
          endereco_cliente,
          telefone_cliente,
          restaurante: {
            connect: { id: parseInt(restauranteId) },
          },
          produtos: {
            connect: { id: parseInt(produtoId) },
          }
        },
      });

      res.status(201).json(pedido);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };





  static getPedido = async (req: Request, res: Response) => {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {produtos: true} 
      });
      res.status(200).json(pedidos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }




  static getPedidoById = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const pedidos = await prisma.pedido.findUnique({ where: {id: parseInt(id)} });
      res.status(200).json(pedidos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }




  static updatePedido = async (req: Request, res: Response) => {
    const {
      valor_total,
      nome_cliente,
      cidade_cliente,
      endereco_cliente,
      telefone_cliente,
      RestauranteId
    } = req.body;
    const { id } = req.params;

    const restt = await prisma.restaurante.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!restt) {
      res
        .status(500)
        .json({
          message: `Pedido com ID ${id} não encontrado.`,
        });
      return;
    }
    try {
      const pedido = await prisma.pedido.update({
        where: { id: parseInt(id) },
        data: {
          valor_total,
          nome_cliente,
          cidade_cliente,
          endereco_cliente,
          telefone_cliente,
          RestauranteId,
        },
      });

      res.status(201).json(pedido);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };





  static deletePedido = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.pedido.delete({
        where: { id: parseInt(id) }
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
