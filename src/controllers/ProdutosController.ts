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
  







}
