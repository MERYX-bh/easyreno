import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }

  async create(email: string, password: string, userType: string) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        userType,
      },
    });
  }
}