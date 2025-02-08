import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        userType: string;
    }>;
    findById(id: string): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        userType: string;
    }>;
    create(email: string, password: string, userType: string): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        userType: string;
    }>;
}
