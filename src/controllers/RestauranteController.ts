import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class RestauranteController {

    static createRestaurante = async (req: Request, res: Response) => {
      const { nome, email, senha, categoria, cidade, endereco, telefone } = req.body;
    
      try {
        const restaurante = await prisma.restaurante.create({
          data: { nome, email, senha, categoria, cidade, endereco, telefone }
        });
    
        res.status(201).json(restaurante);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    };
    
    static getRestaurantes = async (req: Request, res: Response) => {
      try {
        const restaurantes = await prisma.restaurante.findMany();
        res.status(200).json(restaurantes);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    };
    
    static getRestauranteById = async (req: Request, res: Response) => {
      const { id } = req.params;
    
      try {
        const restaurante = await prisma.restaurante.findUnique({
          where: { id: parseInt(id) }
        });
    
        if (!restaurante) {
          res.status(404).json({ message: `Restaurante com ID ${id} não encontrado.` });
        } else {
          res.status(200).json(restaurante);
        }
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    };
    
    static updateRestaurante = async (req: Request, res: Response) => {
      const { id } = req.params;
      const { nome, email, senha, categoria, cidade, endereco, telefone } = req.body;
    
      try {
        const restaurante = await prisma.restaurante.update({
          where: { id: parseInt(id) },
          data: { nome, email, senha, categoria, cidade, endereco, telefone }
        });
    
        res.status(200).json(restaurante);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    };
    
    static deleteRestaurante = async (req: Request, res: Response) => {
      const { id } = req.params;
    
      try {
        await prisma.restaurante.delete({
          where: { id: parseInt(id) }
        });
    
        res.status(204).send();
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    };

}    
