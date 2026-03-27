import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AdminUser } from '../entities';
export declare class AuthService {
    private readonly adminUserRepo;
    private readonly jwtService;
    constructor(adminUserRepo: Repository<AdminUser>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<AdminUser>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
        };
    }>;
}
