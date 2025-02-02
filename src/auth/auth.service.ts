import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';  // ✅ Import PrismaService
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,  // ✅ Injecte PrismaService ici
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
 
  async login(email: string, motDePasse: string) {
    let user: any = null;
    let userType: "company" | "owner" | null = null;
    let companyId = null;

    // 1️⃣ Vérifier si l'utilisateur est une entreprise
    const company = await this.prisma.company.findUnique({ where: { email } });
    if (company) {
        user = company;
        userType = "company";
        companyId = company.id; // ✅ Stocker l'ID de l'entreprise
    }

    // 2️⃣ Vérifier si l'utilisateur est un propriétaire
    if (!user) {
        const owner = await this.prisma.owner.findUnique({ where: { email } });
        if (owner) {
            user = owner;
            userType = "owner";
        }
    }

    // 3️⃣ Vérifier que l'utilisateur existe
    if (!user || !userType) {
        throw new BadRequestException("Email incorrect ou utilisateur non trouvé.");
    }

    // 4️⃣ Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!passwordMatch) {
        throw new BadRequestException("Mot de passe incorrect.");
    }

    // 5️⃣ Générer le token JWT en incluant companyId si c'est une entreprise
    const token = this.jwtService.sign({
        email: user.email,
        id: user.id,
        userType,
        companyId: userType === "company" ? companyId : null, // ✅ Ajout du companyId
    });

    return {
        message: "Connexion réussie !",
        token,
        userType,
        companyId, // ✅ Retourner aussi companyId
    };
}

  
  
  
  async register(email: string, password: string, userType: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create(email, hashedPassword, userType);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new Error('User not found');
      }
      return this.login(user.email, user.password);  // ✅ Passer les bons arguments
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
