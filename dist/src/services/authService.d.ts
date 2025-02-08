export declare class AuthService {
    registerUser(email: string, password: string, userType: string): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        userType: string;
    }>;
    validateUser(email: string, password: string): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        userType: string;
    }>;
    generateToken(userId: string): string;
    generateRefreshToken(userId: string): string;
    refreshToken(token: string): Promise<string>;
}
