import { Controller, Get, Post, Body, Param, UseGuards, Req,UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
@UseGuards(JwtAuthGuard)
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('/owner')
  async getOwnerExchanges(@Req() req) {
    console.log("🔍 Utilisateur connecté :", req.user); // 🔥 Debug ici
  
    if (!req.user) {
      throw new UnauthorizedException("Utilisateur non authentifié");
    }
  
    return this.exchangeService.getOwnerExchanges(req.user.id);
  }
  
  
  @Get('/company')
async getCompanyExchanges(@Req() req) {
    console.log("🔍 Fetching exchanges for companyId:", req.user.companyId);
    const exchanges = await this.exchangeService.getCompanyExchanges(req.user.companyId);
    
    console.log("📩 Fetched Exchanges:", exchanges);
    return Array.isArray(exchanges) ? exchanges : [];
}

  
  // ✅ Récupérer les détails d'un échange spécifique
  @Get('/:exchangeId')
  async getExchangeDetails(@Param('exchangeId') exchangeId: string) {
    return this.exchangeService.getExchangeDetails(Number(exchangeId));
  }
  @Post('/message/:exchangeId')
  async sendMessage(
    @Req() req,
    @Param('exchangeId') exchangeId: string,
    @Body() body: { content: string; fileUrl?: string }
  ) {
    console.log("🔍 Utilisateur authentifié :", req.user); // 🔥 Debug
    
    return this.exchangeService.sendMessageInExchange(
      Number(exchangeId),
      req.user.id,
      req.user.role, 
      body.content,
      body.fileUrl
    );
  }
  
  
  // ✅ Récupérer les devis d'une entreprise
  @Get('/company/quotes')
  async getCompanyQuotes(@Req() req) {
    return this.exchangeService.getCompanyQuotes(req.user.companyId);
  }

  // ✅ Envoyer un message avec un devis
  @Post('/company/message')
  async sendQuoteMessage(
    @Req() req,
    @Body() body: { ownerId: number; quoteId: number; content: string }
  ) {
    console.log("📩 Message reçu:", { companyId: req.user.companyId, ...body });
    return this.exchangeService.sendQuoteMessage(
      req.user.companyId,
      body.ownerId,
      body.quoteId,
      body.content
    );
  }
  
}
