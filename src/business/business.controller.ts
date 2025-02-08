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
  Req,Patch, Delete
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

  @Get('my-quotes')
  async getMyQuotes(@Req() req) {
      console.log("🔍 Debug - Utilisateur connecté :", req.user);
  
      if (!req.user || req.user.role !== 'company') {
          return { message: "Utilisateur non autorisé" }; // ⚠️ Problème ici
      }
  
      const companyId = req.user.companyId;
      return this.businessService.getQuotesByCompany(companyId);
  }
  

  // ✅ Transformer une annonce en chantier
  @Post('/convert-to-chantier/:annonceId')
  async convertToChantier(@Req() req, @Param('annonceId') annonceId: string) {
    console.log("🔍 Transformation en chantier pour annonce :", annonceId);
    return this.businessService.transformAnnonceToChantier(Number(annonceId), req.user.companyId);
  }

  @Post('/chantier/:chantierId/add-step')
async addStep(
    @Param('chantierId') chantierId: string,
    @Body() body: { stepName: string; details: string[] },
    @Req() req: AuthenticatedRequest
) {
    console.log("🔍 Ajout d'une étape :", body.stepName);

    if (!body.stepName || !body.details || body.details.length === 0) {
        throw new BadRequestException("Les champs 'stepName' et 'details' sont obligatoires.");
    }

    return this.businessService.addStep(Number(chantierId), body.stepName, body.details);
}
  
@Delete('chantier/:chantierId')
async deleteChantier(@Param('chantierId') chantierId: string) {
    console.log(`🚧 Suppression du chantier ID: ${chantierId}`);
    return this.businessService.deleteChantier(Number(chantierId));
}

  // ✅ Récupérer les étapes d'un chantier
  @Get('chantier/:chantierId/steps')
  async getSteps(@Param('chantierId') chantierId: string) {
    return this.businessService.getChantierSteps(Number(chantierId));
  }

  @Patch('chantier/validate-step/:stepId')
  async validateStep(@Param('stepId') stepId: number) {
    return this.businessService.validateStep(Number(stepId));
  }
  
  @Patch('chantier/invalidate-step/:stepId')
  async invalidateStep(@Param('stepId') stepId: number) {
    return this.businessService.invalidateStep(Number(stepId));
  }
  
  // ✅ Vérifier si un chantier est terminé
  @Get('/chantier/:chantierId/check-completion')
  async checkCompletion(@Param('chantierId') chantierId: string) {
    return this.businessService.checkChantierCompletion(Number(chantierId));
  }

  // ✅ Ajouter une réserve à une étape
  @Patch('/chantier/add-reserve/:stepId')
  async addReserve(@Param('stepId') stepId: string, @Body() body: { reserveText: string }) {
    console.log("🚨 Ajout de réserve pour l'étape :", stepId);
    return this.businessService.addReserve(Number(stepId), body.reserveText);
  }

  @Get('chantiers')
  async getAllChantiers(@Req() req) {
    return this.businessService.getAllChantiers();
  }  
}
