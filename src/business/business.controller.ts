import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  BadRequestException, 
  UploadedFile, 
  UseInterceptors, 
  Request,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BusinessService } from './business.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

// ✅ Définition d'une interface pour typer `Request`
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    userType: string;
    companyId?: number;
  };
}

@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('ads')
  async getAllAds() {
    return this.businessService.getAllAds();
  }

  @Get('ads/:id')
  async getAdDetails(@Param('id') id: string) {
    return this.businessService.getAdDetails(Number(id));
  }

  @Post('quote/:adId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/quotes', // ✅ Stocke les fichiers dans ce dossier
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `file-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    })
  )
  async createQuote(
    @Req() req,
    @Param('adId') adId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any
  ) {
    console.log('🔍 Fichier reçu:', file); // ✅ Debug: Vérifie que le fichier est bien reçu

    const companyId = req.user.companyId;
    if (!companyId) {
      throw new BadRequestException("ID de l'entreprise introuvable.");
    }

    // ✅ Ajoute le chemin du fichier au devis
    const fileUrl = file ? `/uploads/quotes/${file.filename}` : null;
    console.log("📂 Chemin du fichier enregistré:", file.path);

    return this.businessService.createQuote(Number(companyId), Number(adId), {
      ...data,
      fileUrl,
    });

  }
  
  @Get('quotes/:adId')
  async getQuotesByAd(@Param('adId') adId: string) {
    return this.businessService.getQuotesByAd(Number(adId));
  }

    // ✅ Récupérer les devis proposés par l'entreprise connectée
    @Get('my-quotes')
    async getMyQuotes(@Req() req) {
      console.log("🔍 Debug - Utilisateur connecté :", req.user);
  
      if (!req.user || req.user.userType !== 'company') {
        return { message: "Utilisateur non autorisé" };
      }

  
      const companyId = req.user.companyId;
      return this.businessService.getQuotesByCompany(companyId);
    }
}
