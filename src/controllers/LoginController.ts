import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

class LoginController {
  public static async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;

    const user = await prisma.restaurante.findUnique({ where: { email } });

    if (!user) {
      return res.send({ mensagem: `email ou senha incorretos` });
    }

    if (user.senha !== senha) {
      return res.send({ mensagem: `email ou senha incorretos` });
    }

    const token = jwt.sign({ id: user.id }, 'matheus123', { expiresIn: '1h' });

    const { senha: _, ...userLogin } = user;

    return res.json({
      user: userLogin,
      token: token,
    });
  }

  public static async verificaToken(req: Request, res: Response, next: any): Promise<Response | void> {
    const { authorization } = req.headers;

    const token = authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).send({ mensagem: 'Token não fornecido.' });
    }

    jwt.verify(token, 'matheus123', (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ mensagem: 'Token inválido.' });
      }
      next();
    });
  }
}

export default LoginController;
