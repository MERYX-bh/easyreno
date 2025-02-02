import { Controller, Get, Post, Delete, Body, Req, Param, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('owner')
@UseGuards(JwtAuthGuard) // Protège avec JWT
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  // ✅ Route pour créer une annonce
  @Post('create-ad')
  async createAd(@Req() req, @Body() adData: any) {
    console.log('Utilisateur connecté:', req.user);
    return this.ownerService.createAd(req.user.id, adData);
  }

  // ✅ Route pour récupérer les annonces de l'utilisateur connecté
  @Get('ads')
  async getOwnerAds(@Req() req) {
    return this.ownerService.getOwnerAds(req.user.id);
  }

  // ✅ Route pour récupérer une annonce spécifique par ID
  @Get('ads/:id')
  async getAdById(@Req() req, @Param('id') id: string) {
    console.log(`Récupération de l'annonce avec l'ID: ${id}`);
    return this.ownerService.getAdById(Number(id));
  }

    // ✅ Route pour supprimer une annonce
    @Delete('ads/:id')
    async deleteAd(@Req() req, @Param('id') id: string) {
      console.log(`Suppression de l'annonce avec l'ID: ${id}`);
      return this.ownerService.deleteAd(Number(id));
    }
}
