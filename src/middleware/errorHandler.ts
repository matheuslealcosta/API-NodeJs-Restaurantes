import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Erro interno do servidor';

  // Log do erro
  logger.error('API Error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Erros do Prisma
  if (error.message.includes('Unique constraint')) {
    statusCode = 409;
    message = 'Recurso já existe com estes dados';
  }

  if (error.message.includes('Foreign key constraint')) {
    statusCode = 400;
    message = 'Referência inválida para recurso relacionado';
  }

  if (error.message.includes('Record to update not found')) {
    statusCode = 404;
    message = 'Recurso não encontrado';
  }

  // Erros de validação JWT
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  // Resposta de erro padronizada
  const errorResponse = {
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error,
    }),
  };

  res.status(statusCode).json(errorResponse);
};

// Wrapper para async functions
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Criador de erros personalizados
export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
