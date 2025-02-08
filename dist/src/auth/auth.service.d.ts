import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, motDePasse: string): Promise<{
        message: string;
        token: string;
        userType: "company" | "owner";
        companyId: any;
    }>;
    register(email: string, password: string, userType: string): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        userType: string;
    }>;
    refreshToken(token: string): Promise<{
        message: string;
        token: string;
        userType: "company" | "owner";
        companyId: any;
    }>;
}
