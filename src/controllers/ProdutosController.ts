import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProdutoController {
    
  static createProduto = async (req: Request, res: Response) => {
    const { nome, descricao, quantidade, preco, categoria, pedidoId} = req.body;
    const { restauranteId} = req.params

    const restt = await prisma.restaurante.findUnique({
        where: {
          id: parseInt(restauranteId),
        },
      });

    if(!restt){
        res.status(500).json({ message: `Restaurante com ID ${restauranteId} não encontrado.` })
        return
    }

    try {
        const produto = await prisma.produto.create({
            data: {
              nome,
              descricao,
              quantidade,
              preco,
              categoria,
              restaurante: {
                connect: { id: parseInt(restauranteId) },
              },
              pedido: {
                connect: { id: parseInt(pedidoId)}
              }
            },
          });

      res.status(201).json(produto);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };






  static getProdutos = async (req: Request, res: Response) => {
    try {
      const produtos = await prisma.produto.findMany({
        include: {pedido: true} 
      });

      res.status(200).json(produtos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  






  static getProdutoById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const produto = await prisma.produto.findUnique({
        where: { id: parseInt(id) }
      });

      if (!produto) {
        res.status(404).json({ message: `Produto com ID ${id} não encontrado.` });
      } else {
        res.status(200).json(produto);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };






  static updateProduto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, descricao, quantidade, preco, categoria, RestauranteId, pedidosId} = req.body;

    try {
      const produto = await prisma.produto.update({
        where: { id: parseInt(id) },
        data: { nome, descricao, quantidade, preco, categoria, RestauranteId}
      });

      res.status(200).json(produto);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };






  static deleteProduto = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.produto.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  static getProdutosByRestaurante = async (req: Request, res: Response) => {
    const { restauranteId } = req.params;

    try {
      const produtos = await prisma.produto.findMany({
        where: { RestauranteId: parseInt(restauranteId) },
        include: { restaurante: true }
      });

      res.status(200).json(produtos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
