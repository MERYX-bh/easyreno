import { Injectable,NotFoundException } from '@nestjs/common';
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
        where: {
          ownerId: ownerId,
          quotes: {
            none: { status: "accepted" }, 
          },
        },
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
 // ✅ Récupérer les devis pour une annonce spécifique
 async getOffersForAd(adId: number, ownerId: number) {
  const ad = await this.prisma.ad.findFirst({
    where: { id: adId, ownerId: ownerId },
  });

  if (!ad) {
    throw new NotFoundException("Aucune annonce trouvée pour cet ID ou non autorisée.");
  }

  return await this.prisma.quote.findMany({
    where: { adId: adId },
    include: { company: true },
  });
}

// ✅ Accepter un devis et rejeter les autres
async acceptOffer(quoteId: number) {
  // Récupérer l'offre sélectionnée
  const selectedQuote = await this.prisma.quote.findUnique({
    where: { id: quoteId },
  });

  if (!selectedQuote) {
    throw new NotFoundException("Devis introuvable.");
  }

  // Mettre à jour l'offre acceptée
  await this.prisma.quote.update({
    where: { id: quoteId },
    data: { status: "accepted" },
  });

  // Rejeter toutes les autres offres pour la même annonce
  await this.prisma.quote.updateMany({
    where: {
      adId: selectedQuote.adId,
      id: { not: quoteId }, // Exclure l'offre acceptée
    },
    data: { status: "rejected" },
  });

  return { message: "Offre acceptée avec succès et les autres offres ont été rejetées." };
}

// ✅ Refuser un devis
async rejectOffer(quoteId: number) {
  return await this.prisma.quote.update({
    where: { id: quoteId },
    data: { status: "rejected" },
  });
}
async getOwnerChantiers(ownerId: number) {
  try {
    if (!ownerId) {
      throw new Error("L'ID du propriétaire est requis.");
    }

    // ✅ Récupérer les annonces créées par cet owner
    const ownerAds = await this.prisma.ad.findMany({
      where: { ownerId: ownerId },
      select: { id: true }
    });

    if (!ownerAds.length) {
      throw new NotFoundException("Aucune annonce trouvée pour cet utilisateur.");
    }

    const adIds = ownerAds.map(ad => ad.id);

    // ✅ Récupérer les chantiers qui ont un `adId` correspondant
    const chantiers = await this.prisma.chantier.findMany({
      where: { adId: { in: adIds } },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            location: true
          }
        }
      }
    });

    return chantiers;
  } catch (error) {
    console.error("Erreur lors de la récupération des chantiers:", error);
    throw new Error('Erreur lors de la récupération des chantiers: ' + error.message);
  }
}


async acceptOfferAndCreateChantier(quoteId: number) {
  // 🔍 Récupérer l'offre sélectionnée
  const selectedQuote = await this.prisma.quote.findUnique({
    where: { id: quoteId },
    include: { ad: true, company: true },
  });

  if (!selectedQuote) {
    throw new NotFoundException("Devis introuvable.");
  }

  // 🔥 Vérifier si un chantier existe déjà pour cette annonce
  const existingChantier = await this.prisma.chantier.findUnique({
    where: { adId: selectedQuote.adId },
  });

  if (existingChantier) {
    throw new Error("Ce projet a déjà été transformé en chantier.");
  }

  // ✅ Mettre à jour l'offre acceptée
  await this.prisma.quote.update({
    where: { id: quoteId },
    data: { status: "accepted" },
  });

  // ❌ Rejeter toutes les autres offres pour la même annonce
  await this.prisma.quote.updateMany({
    where: {
      adId: selectedQuote.adId,
      id: { not: quoteId },
    },
    data: { status: "rejected" },
  });

  // ✅ Transformer l'annonce en chantier SANS supprimer l'annonce
  const chantier = await this.prisma.chantier.create({
    data: {
      adId: selectedQuote.adId, // 🔗 Lier au projet
      companyId: selectedQuote.company.id, // 🔗 Lier à l'entreprise
      status: "en cours",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log("✅ Chantier créé :", chantier);

  return {
    message: "L'offre a été acceptée et transformée en chantier.",
    chantier,
  };
}

async getChantierSteps(chantierId: number, ownerId: number) {
  // Vérifier si le chantier appartient à l'owner
  const chantier = await this.prisma.chantier.findFirst({
    where: { id: chantierId, ad: { ownerId: ownerId } }, // Vérifie que l'annonce appartient à l'owner
    include: { etapes: true }, // Inclure les étapes
  });

  if (!chantier) {
    throw new NotFoundException("Chantier introuvable ou non autorisé.");
  }

  // Formater les étapes
  return chantier.etapes.map(etape => ({
    id: etape.id,
    name: etape.name,
    details: typeof etape.details === "string" ? JSON.parse(etape.details) : etape.details,
    completed: etape.companyValidated,
    createdAt: etape.createdAt,
  }));
}

}
