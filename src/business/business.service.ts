import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  // ✅ Récupérer toutes les annonces pour les entreprises
  async getAllAds() {
    return this.prisma.ad.findMany({
        where: {
            quotes: {
                none: { status: "accepted" }, // ✅ Filtrer les annonces SANS un devis accepté
            },
        },
        include: {
            owner: { select: { nom: true } },
            quotes: { select: { status: true } },
        },
    });
}
sss

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
      include: { company: true }, 
    });
  }
  
  async getQuotesByCompany(companyId: number) {
    console.log("🔍 Debug - Récupération des devis pour companyId :", companyId);

    if (!companyId) {
        throw new UnauthorizedException("Utilisateur non autorisé");
    }

    const quotes = await this.prisma.quote.findMany({
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

    return Array.isArray(quotes) ? quotes : [];
}


  async transformAnnonceToChantier(annonceId: number, companyId: number) {
    // Vérifier si l'annonce existe et si elle est déjà un chantier
    const annonce = await this.prisma.ad.findUnique({
      where: { id: annonceId },
    });

    if (!annonce) {
      throw new NotFoundException("Annonce introuvable.");
    }

    // Vérifier si l'annonce a déjà été transformée en chantier
    const existingChantier = await this.prisma.chantier.findUnique({
      where: { adId: annonceId },
    });

    if (existingChantier) {
      throw new UnauthorizedException("Cette annonce est déjà un chantier.");
    }

    // ✅ Transformer l'annonce en chantier
    const chantier = await this.prisma.chantier.create({
      data: {
        adId: annonceId, 
        companyId,
        status: "en cours",
      },
    });

    console.log("✅ Chantier créé :", chantier);
    return chantier;
}


async addStep(chantierId: number, stepName: string, details: string[]) {
  const chantier = await this.prisma.chantier.findUnique({
      where: { id: chantierId },
  });

  if (!chantier) {
      throw new NotFoundException("Chantier introuvable.");
  }

  // ✅ Sauvegarde les détails sous forme de JSON
  const step = await this.prisma.etape.create({
      data: {
          chantierId,
          name: stepName,
          completed: false,
          details: details,
      },
  });

  console.log("✅ Étape ajoutée :", step);
  return step;
}

async getChantierSteps(chantierId: number) {
  const steps = await this.prisma.etape.findMany({
    where: { chantierId },
    orderBy: { id: 'asc' },
  });

  const formattedSteps = steps.map(step => ({
    ...step,
    completed: step.companyValidated ? true : false, // ✅ Vérifie si validé par l'entreprise
    details: typeof step.details === "string" ? JSON.parse(step.details) : step.details, 
  }));

  console.log("✅ Étapes retournées au frontend :", formattedSteps); // Debug
  return formattedSteps;
}

async validateStep(stepId: number) {
  const step = await this.prisma.etape.findUnique({
    where: { id: stepId },
  });

  if (!step) {
    throw new NotFoundException("Étape introuvable.");
  }

  // ✅ Utiliser `true` au lieu de `1`
  const updatedStep = await this.prisma.etape.update({
    where: { id: stepId },
    data: { companyValidated: true, completed: true },
  });

  console.log(`✅ Étape validée :`, updatedStep);
  return updatedStep;
}
async invalidateStep(stepId: number) {
  const step = await this.prisma.etape.findUnique({
    where: { id: stepId },
  });

  if (!step) {
    throw new NotFoundException("Étape introuvable.");
  }

  // ✅ Utiliser `false` au lieu de `0`
  const updatedStep = await this.prisma.etape.update({
    where: { id: stepId },
    data: { companyValidated: false, completed: false },
  });

  console.log(`❌ Étape invalidée :`, updatedStep);
  return updatedStep;
}

  // ✅ Vérifier si toutes les étapes sont complétées
  async checkChantierCompletion(chantierId: number) {
    const chantier = await this.prisma.chantier.findUnique({
      where: { id: chantierId },
      include: { etapes: true },
    });

    if (!chantier) {
      throw new NotFoundException("Chantier introuvable.");
    }

    const allCompleted = chantier.etapes.every(step => step.completed);
    if (allCompleted) {
      await this.prisma.chantier.update({
        where: { id: chantierId },
        data: { status: "terminé" },
      });

      console.log("🏁 Chantier terminé !");
    }

    return allCompleted;
  }

  // ✅ Ajouter des réserves à une étape
  async addReserve(stepId: number, reserveText: string) {
    const step = await this.prisma.etape.findUnique({
      where: { id: stepId },
    });

    if (!step) {
      throw new NotFoundException("Étape introuvable.");
    }

    const updatedStep = await this.prisma.etape.update({
      where: { id: stepId },
      data: {
        reserve: reserveText,
        completed: false, // Remettre l'étape en attente de validation
      },
    });

    console.log("🚨 Réserve ajoutée :", updatedStep);
    return updatedStep;
  }

  async getAllChantiers() {
    return this.prisma.chantier.findMany({
      include: {
        ad: { select: { title: true, maxBudget: true, createdAt: true } }, // ✅ Récupération des infos de l'annonce
        etapes: { select: { completed: true } }, // ✅ Récupération des étapes pour calculer la progression
        company: { select: { nomEntreprise: true } }, // ✅ Récupération du nom de l'entreprise
      },
    }).then(chantiers => chantiers.map(chantier => ({
      id: chantier.id,
      title: chantier.ad.title, // ✅ Titre de l'annonce liée
      startDate: chantier.ad.createdAt, // ✅ Date de création de l'annonce comme début
      estimatedEndDate: null, // ⚠️ Manquant dans ton modèle. Ajoute-le si nécessaire.
      budget: chantier.ad.maxBudget, // ✅ Budget de l'annonce
      companyName: chantier.company.nomEntreprise, // ✅ Nom de l'entreprise
      status: chantier.status, // ✅ Statut du chantier
      progress: chantier.etapes.length > 0
        ? Math.round((chantier.etapes.filter(e => e.completed).length / chantier.etapes.length) * 100)
        : 0, // ✅ Calcul de la progression en %
    })));
  }

  async deleteChantier(chantierId: number) {
    const chantier = await this.prisma.chantier.findUnique({
        where: { id: chantierId },
    });

    if (!chantier) {
        throw new NotFoundException("Chantier introuvable.");
    }

    // ✅ Suppression du chantier et de ses étapes associées
    await this.prisma.etape.deleteMany({ where: { chantierId } });
    await this.prisma.chantier.delete({ where: { id: chantierId } });

    console.log("🏗️ Chantier supprimé avec succès !");
    return { message: "Chantier supprimé avec succès." };
}

}
