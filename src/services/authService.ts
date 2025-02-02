import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
  async registerUser(email: string, password: string, userType: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: { email, password: hashedPassword, userType }
    });
  }

  async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  generateToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }

  generateRefreshToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
      return this.generateToken(decoded.id);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}