import { Controller, Post, Body, UnauthorizedException,BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login/company')  // 📌 Ajoute cette route
  async loginCompany(@Body() body: { email: string; motDePasse: string }) {
    if (!body.email || !body.motDePasse) {
      throw new BadRequestException('Email et mot de passe sont requis');
    }
    return this.authService.login(body.email, body.motDePasse);
  }

  @Post('login')
  async login(@Body() body: { email: string; motDePasse: string }) {
    if (!body.email || !body.motDePasse) {
      throw new BadRequestException('Email et mot de passe sont requis');
    }
    return this.authService.login(body.email, body.motDePasse);
  }

  @Post('register')
  async register(@Body() registerDto: { email: string; password: string; userType: string }) {
    return this.authService.register(registerDto.email, registerDto.password, registerDto.userType);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}