import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async createAd(ownerId: number, adData: any) {
    try {
      if (!ownerId) {
        throw new Error('ownerId est requis pour créer une annonce.');
      }

      // Création de l'annonce
      const newAd = await this.prisma.ad.create({
        data: {
          title: adData.title,
          location: adData.location,
          workArea: adData.workArea,
          maxBudget: parseFloat(adData.maxBudget),
          description: adData.description,
          owner: { connect: { id: ownerId } }, // Lier l'annonce au propriétaire
        },
      });

      return { message: 'Annonce créée avec succès', ad: newAd };
    } catch (error) {
      console.error('Erreur lors de la création de l’annonce:', error.message);
      throw new Error('Erreur lors de la création de l’annonce: ' + error.message);
    }
  }

  async getOwnerAds(ownerId: number) {
    try {
      return await this.prisma.ad.findMany({
        where: { ownerId: ownerId },
        include: { owner: true },
      });
    } catch (error) {
      throw new Error('Erreur lors de la récupération des annonces: ' + error.message);
    }
  }

  // ✅ Méthode pour récupérer une annonce par ID
  async getAdById(adId: number) {
    try {
      const ad = await this.prisma.ad.findUnique({
        where: { id: adId },
      });

      if (!ad) {
        throw new Error(`Aucune annonce trouvée avec l'ID: ${adId}`);
      }

      return ad;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l’annonce: ' + error.message);
    }
  }

  async deleteAd(adId: number) {
    try {
      const existingAd = await this.prisma.ad.findUnique({
        where: { id: adId },
      });
  
      if (!existingAd) {
        throw new Error(`Aucune annonce trouvée avec l'ID: ${adId}`);
      }
  
      await this.prisma.ad.delete({
        where: { id: adId },
      });
  
      return { message: 'Annonce supprimée avec succès' };
    } catch (error) {
      throw new Error('Erreur lors de la suppression de l’annonce: ' + error.message);
    }
  }
  
}
