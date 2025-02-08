"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(email, motDePasse) {
        let user = null;
        let userType = null;
        let companyId = null;
        const company = await this.prisma.company.findUnique({ where: { email } });
        if (company) {
            user = company;
            userType = "company";
            companyId = company.id;
        }
        if (!user) {
            const owner = await this.prisma.owner.findUnique({ where: { email } });
            if (owner) {
                user = owner;
                userType = "owner";
            }
        }
        if (!user || !userType) {
            throw new common_1.BadRequestException("Email incorrect ou utilisateur non trouvé.");
        }
        const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!passwordMatch) {
            throw new common_1.BadRequestException("Mot de passe incorrect.");
        }
        const token = this.jwtService.sign({
            email: user.email,
            id: user.id,
            userType,
            companyId: userType === "company" ? companyId : null,
        });
        return {
            message: "Connexion réussie !",
            token,
            userType,
            companyId,
        };
    }
    async register(email, password, userType) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.create(email, hashedPassword, userType);
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new Error('User not found');
            }
            return this.login(user.email, user.password);
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map