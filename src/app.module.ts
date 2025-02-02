import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './business/business.module';
import { OwnerModule } from './owner/owner.module';
import { PrismaService } from '../prisma/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';  // Ajouté

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BusinessModule,
    OwnerModule,
  ],
  controllers: [AppController],  
  providers: [AppService, PrismaService], 
})
export class AppModule {}
