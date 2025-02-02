import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  // ✅ Récupérer toutes les annonces pour les entreprises
  async getAllAds() {
    return this.prisma.ad.findMany({
      include: { owner: true, quotes: true }, // Inclut les infos du propriétaire et des devis
    });
  }

  // ✅ Récupérer une annonce spécifique
  async getAdDetails(id: number) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException(`Aucune annonce trouvée avec l'ID ${id}`);
    }

    return ad;
  }

  async createQuote(companyId: number, adId: number, data: any) {
    try {
      // Vérifier si l'annonce existe et récupérer ownerId
      const ad = await this.prisma.ad.findUnique({
        where: { id: adId },
        select: { ownerId: true }, // Récupérer uniquement l'ownerId
      });
  
      if (!ad) {
        throw new Error(`Annonce avec ID ${adId} introuvable.`);
      }
  
      // Vérification des données
      if (!data.title || !data.price || !data.description) {
        throw new Error('Les champs title, price et description sont obligatoires.');
      }
  
      // Conversion en Float pour éviter NaN
      const priceFloat = parseFloat(data.price);
      if (isNaN(priceFloat)) {
        throw new Error('Le prix doit être un nombre valide.');
      }
  
      // Création du devis avec ownerId récupéré depuis l'annonce
      return await this.prisma.quote.create({
        data: {
          title: data.title,
          price: priceFloat,
          description: data.description,
          fileUrl: data.fileUrl || null, // Optionnel
          status: "pending",
          company: { connect: { id: companyId } },
          ad: { connect: { id: adId } },
          owner: { connect: { id: ad.ownerId } }, // 🔥 Ajout automatique de ownerId
        },
      });
    } catch (error) {
      throw new Error(`Erreur lors de la création du devis: ${error.message}`);
    }
  }
  



  // ✅ Récupérer les devis liés à une annonce
  async getQuotesByAd(adId: number) {
    return this.prisma.quote.findMany({
      where: { adId: adId },
      include: { company: true }, // Correction ici pour inclure Company
    });
  }

  // ✅ Récupérer tous les devis proposés par une entreprise
  async getQuotesByCompany(companyId: number) {
    return this.prisma.quote.findMany({
      where: { companyId },
      include: {
        ad: {
          select: { 
            title: true, 
            maxBudget: true, 
            owner: { select: { nom: true } }
          }
        }
      },
    });
  }
}
