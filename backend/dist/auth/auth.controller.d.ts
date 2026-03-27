import { AuthService } from './auth.service';
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
        };
    }>;
}
export {};
