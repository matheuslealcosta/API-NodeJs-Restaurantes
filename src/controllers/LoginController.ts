import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Schema de validação para login
const loginSchema = z.object({
  email: z.string()
    .email('Email deve ter um formato válido')
    .min(1, 'Email é obrigatório'),
  senha: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});

// Interface para request com usuário autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

class LoginController {
  public static login = asyncHandler(async (req: Request, res: Response) => {
    // Validação dos dados de entrada
    const validatedData = loginSchema.parse(req.body);
    const { email, senha } = validatedData;

    // Busca o restaurante pelo email
    const user = await prisma.restaurante.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    
    if (!isPasswordValid) {
      logger.warn(`Tentativa de login inválida para email: ${email}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      throw new AppError('Email ou senha incorretos', 401);
    }

    // Gera o token JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      JWT_SECRET as string, 
      { 
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'api-restaurants',
        audience: 'restaurant-client',
      } as jwt.SignOptions
    );

    // Remove a senha da resposta
    const { senha: _, ...userResponse } = user;

    // Log do login bem-sucedido
    logger.info(`Login realizado com sucesso para: ${email}`, {
      userId: user.id,
      ip: req.ip,
    });

    // Resposta
    res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: {
        user: userResponse,
        token,
        expiresIn: JWT_EXPIRES_IN,
      },
    });
  });

  public static verificaToken = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Token de acesso é obrigatório', 401);
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new AppError('Token de acesso é obrigatório', 401);
      }

      try {
        const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
        
        const decoded = jwt.verify(token, JWT_SECRET as string, {
          issuer: 'api-restaurants',
          audience: 'restaurant-client',
        } as jwt.VerifyOptions) as { id: number; email: string };

        // Verifica se o usuário ainda existe
        const user = await prisma.restaurante.findUnique({
          where: { id: decoded.id },
          select: { id: true, email: true, nome: true },
        });

        if (!user) {
          throw new AppError('Token inválido - usuário não encontrado', 401);
        }

        // Adiciona o usuário ao request
        req.user = {
          id: decoded.id,
          email: decoded.email,
        };

        next();
      } catch (error: any) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new AppError('Token inválido', 401);
        }
        
        if (error instanceof jwt.TokenExpiredError) {
          throw new AppError('Token expirado', 401);
        }

        throw error;
      }
    }
  );

  // Refresh token (opcional)
  public static refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    
    if (!user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
    
    const newToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      JWT_SECRET as string, 
      { 
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'api-restaurants',
        audience: 'restaurant-client',
      } as jwt.SignOptions
    );

    res.status(200).json({
      status: 'success',
      message: 'Token renovado com sucesso',
      data: {
        token: newToken,
        expiresIn: JWT_EXPIRES_IN,
      },
    });
  });

  // Logout (adiciona token a blacklist - implementação futura)
  public static logout = asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implementar blacklist de tokens se necessário
    
    res.status(200).json({
      status: 'success',
      message: 'Logout realizado com sucesso',
    });
  });
}

export default LoginController;
