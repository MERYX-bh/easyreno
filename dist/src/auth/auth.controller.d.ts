import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    loginCompany(body: {
        email: string;
        motDePasse: string;
    }): Promise<{
        message: string;
        token: string;
        userType: "company" | "owner";
        companyId: any;
    }>;
    login(body: {
        email: string;
        motDePasse: string;
    }): Promise<{
        message: string;
        token: string;
        userType: "company" | "owner";
        companyId: any;
    }>;
    register(registerDto: {
        email: string;
        password: string;
        userType: string;
    }): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        userType: string;
    }>;
    refreshToken(body: {
        refreshToken: string;
    }): Promise<{
        message: string;
        token: string;
        userType: "company" | "owner";
        companyId: any;
    }>;
}
