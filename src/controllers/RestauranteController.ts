import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Schema de validação para criação de restaurante
const createRestauranteSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string()
    .email('Email deve ter um formato válido')
    .transform(email => email.toLowerCase()),
  senha: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  categoria: z.string()
    .min(2, 'Categoria deve ter pelo menos 2 caracteres')
    .max(50, 'Categoria deve ter no máximo 50 caracteres'),
  cidade: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  endereco: z.string()
    .min(10, 'Endereço deve ter pelo menos 10 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 caracteres')
    .max(15, 'Telefone deve ter no máximo 15 caracteres')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Formato de telefone inválido'),
});

// Schema para atualização (campos opcionais)
const updateRestauranteSchema = createRestauranteSchema.partial();

// Schema para parâmetros de ID
const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID deve ser um número válido').transform(Number),
});

export class RestauranteController {
  
  static createRestaurante = asyncHandler(async (req: Request, res: Response) => {
    // Validação dos dados de entrada
    const validatedData = createRestauranteSchema.parse(req.body);
    const { nome, email, senha, categoria, cidade, endereco, telefone } = validatedData;

    // Verifica se já existe restaurante com este email ou telefone
    const existingRestaurante = await prisma.restaurante.findFirst({
      where: {
        OR: [
          { email },
          { telefone },
        ],
      },
    });

    if (existingRestaurante) {
      if (existingRestaurante.email === email) {
        throw new AppError('Já existe um restaurante com este email', 409);
      }
      if (existingRestaurante.telefone === telefone) {
        throw new AppError('Já existe um restaurante com este telefone', 409);
      }
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Cria o restaurante
    const restaurante = await prisma.restaurante.create({
      data: { 
        nome, 
        email, 
        senha: hashedPassword, 
        categoria, 
        cidade, 
        endereco, 
        telefone 
      },
      select: {
        id: true,
        nome: true,
        email: true,
        categoria: true,
        cidade: true,
        endereco: true,
        telefone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`Restaurante criado com sucesso: ${nome}`, {
      restauranteId: restaurante.id,
      email: restaurante.email,
    });

    res.status(201).json({
      status: 'success',
      message: 'Restaurante criado com sucesso',
      data: {
        restaurante,
      },
    });
  });

  static getRestaurantes = asyncHandler(async (req: Request, res: Response) => {
    // Parâmetros de paginação
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const skip = (page - 1) * limit;

    // Filtros opcionais
    const categoria = req.query.categoria as string;
    const cidade = req.query.cidade as string;
    const search = req.query.search as string;

    // Constrói o where dinamicamente
    const where: any = {};
    
    if (categoria) {
      where.categoria = {
        contains: categoria,
        mode: 'insensitive',
      };
    }
    
    if (cidade) {
      where.cidade = {
        contains: cidade,
        mode: 'insensitive',
      };
    }
    
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { categoria: { contains: search, mode: 'insensitive' } },
        { cidade: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Busca os restaurantes com contagem total
    const [restaurantes, total] = await Promise.all([
      prisma.restaurante.findMany({
        where,
        select: {
          id: true,
          nome: true,
          email: true,
          categoria: true,
          cidade: true,
          endereco: true,
          telefone: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              produto_restaurante: true,
              pedido_restaurante: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.restaurante.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      data: {
        restaurantes,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  });

  static getRestauranteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const restaurante = await prisma.restaurante.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        categoria: true,
        cidade: true,
        endereco: true,
        telefone: true,
        createdAt: true,
        updatedAt: true,
        produto_restaurante: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            categoria: true,
            quantidade: true,
          },
          take: 10, // Limita a 10 produtos
          orderBy: {
            createdAt: 'desc',
          },
        },
        pedido_restaurante: {
          select: {
            id: true,
            valor_total: true,
            nome_cliente: true,
            createdAt: true,
          },
          take: 5, // Limita a 5 pedidos recentes
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            produto_restaurante: true,
            pedido_restaurante: true,
          },
        },
      },
    });

    if (!restaurante) {
      throw new AppError(`Restaurante com ID ${id} não encontrado`, 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        restaurante,
      },
    });
  });

  static updateRestaurante = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const validatedData = updateRestauranteSchema.parse(req.body);

    // Verifica se o restaurante existe
    const existingRestaurante = await prisma.restaurante.findUnique({
      where: { id },
    });

    if (!existingRestaurante) {
      throw new AppError(`Restaurante com ID ${id} não encontrado`, 404);
    }

    // Se está atualizando email ou telefone, verifica duplicatas
    if (validatedData.email || validatedData.telefone) {
      const conflictingRestaurante = await prisma.restaurante.findFirst({
        where: {
          AND: [
            { id: { not: id } }, // Exclui o próprio restaurante
            {
              OR: [
                ...(validatedData.email ? [{ email: validatedData.email }] : []),
                ...(validatedData.telefone ? [{ telefone: validatedData.telefone }] : []),
              ],
            },
          ],
        },
      });

      if (conflictingRestaurante) {
        if (conflictingRestaurante.email === validatedData.email) {
          throw new AppError('Já existe um restaurante com este email', 409);
        }
        if (conflictingRestaurante.telefone === validatedData.telefone) {
          throw new AppError('Já existe um restaurante com este telefone', 409);
        }
      }
    }

    // Prepara os dados para atualização
    const updateData: any = { ...validatedData };

    // Hash da nova senha se fornecida
    if (validatedData.senha) {
      const saltRounds = 12;
      updateData.senha = await bcrypt.hash(validatedData.senha, saltRounds);
    }

    // Atualiza o restaurante
    const restaurante = await prisma.restaurante.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        categoria: true,
        cidade: true,
        endereco: true,
        telefone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`Restaurante atualizado: ${restaurante.nome}`, {
      restauranteId: id,
      updatedFields: Object.keys(validatedData),
    });

    res.status(200).json({
      status: 'success',
      message: 'Restaurante atualizado com sucesso',
      data: {
        restaurante,
      },
    });
  });

  static deleteRestaurante = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    // Verifica se o restaurante existe
    const existingRestaurante = await prisma.restaurante.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            produto_restaurante: true,
            pedido_restaurante: true,
          },
        },
      },
    });

    if (!existingRestaurante) {
      throw new AppError(`Restaurante com ID ${id} não encontrado`, 404);
    }

    // Verifica se há dependências (produtos ou pedidos)
    const hasProducts = existingRestaurante._count.produto_restaurante > 0;
    const hasOrders = existingRestaurante._count.pedido_restaurante > 0;

    if (hasProducts || hasOrders) {
      throw new AppError(
        'Não é possível deletar o restaurante pois existem produtos ou pedidos associados',
        409
      );
    }

    // Deleta o restaurante
    await prisma.restaurante.delete({
      where: { id },
    });

    logger.info(`Restaurante deletado: ${existingRestaurante.nome}`, {
      restauranteId: id,
    });

    res.status(204).send();
  });

  // Método adicional para estatísticas do restaurante
  static getRestauranteStats = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    // Verifica se o restaurante existe
    const restaurante = await prisma.restaurante.findUnique({
      where: { id },
      select: { id: true, nome: true },
    });

    if (!restaurante) {
      throw new AppError(`Restaurante com ID ${id} não encontrado`, 404);
    }

    // Busca estatísticas
    const [
      totalProdutos,
      totalPedidos,
      pedidosUltimos30Dias,
    ] = await Promise.all([
      prisma.produto.count({ where: { RestauranteId: id } }),
      prisma.pedido.count({ where: { RestauranteId: id } }),
      prisma.pedido.count({
        where: {
          RestauranteId: id,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        restaurante: restaurante.nome,
        stats: {
          totalProdutos,
          totalPedidos,
          pedidosUltimos30Dias,
          // TODO: Implement valorTotalVendas calculation
          // Note: valor_total is stored as string, needs conversion for aggregation
        },
      },
    });
  });
}
