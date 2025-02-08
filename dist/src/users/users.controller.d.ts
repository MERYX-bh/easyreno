import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        userType: string;
    }>;
}
