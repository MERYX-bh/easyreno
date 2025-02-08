import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log("✅ Payload reçu dans JwtStrategy:", payload); // 🔥 Debug
  
    return {
      id: payload.id,
      email: payload.email,
      role: payload.userType,  // ✅ Utiliser 'userType' comme 'role'
      companyId: payload.companyId || null,
    };
  }
  
}