"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OwnerService = class OwnerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAd(ownerId, adData) {
        try {
            if (!ownerId) {
                throw new Error('ownerId est requis pour créer une annonce.');
            }
            const newAd = await this.prisma.ad.create({
                data: {
                    title: adData.title,
                    location: adData.location,
                    workArea: adData.workArea,
                    maxBudget: parseFloat(adData.maxBudget),
                    description: adData.description,
                    owner: { connect: { id: ownerId } },
                },
            });
            return { message: 'Annonce créée avec succès', ad: newAd };
        }
        catch (error) {
            console.error('Erreur lors de la création de l’annonce:', error.message);
            throw new Error('Erreur lors de la création de l’annonce: ' + error.message);
        }
    }
    async getOwnerAds(ownerId) {
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
        }
        catch (error) {
            throw new Error('Erreur lors de la récupération des annonces: ' + error.message);
        }
    }
    async getAdById(adId) {
        try {
            const ad = await this.prisma.ad.findUnique({
                where: { id: adId },
            });
            if (!ad) {
                throw new Error(`Aucune annonce trouvée avec l'ID: ${adId}`);
            }
            return ad;
        }
        catch (error) {
            throw new Error('Erreur lors de la récupération de l’annonce: ' + error.message);
        }
    }
    async deleteAd(adId) {
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
        }
        catch (error) {
            throw new Error('Erreur lors de la suppression de l’annonce: ' + error.message);
        }
    }
    async getOffersForAd(adId, ownerId) {
        const ad = await this.prisma.ad.findFirst({
            where: { id: adId, ownerId: ownerId },
        });
        if (!ad) {
            throw new common_1.NotFoundException("Aucune annonce trouvée pour cet ID ou non autorisée.");
        }
        return await this.prisma.quote.findMany({
            where: { adId: adId },
            include: { company: true },
        });
    }
    async acceptOffer(quoteId) {
        const selectedQuote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
        });
        if (!selectedQuote) {
            throw new common_1.NotFoundException("Devis introuvable.");
        }
        await this.prisma.quote.update({
            where: { id: quoteId },
            data: { status: "accepted" },
        });
        await this.prisma.quote.updateMany({
            where: {
                adId: selectedQuote.adId,
                id: { not: quoteId },
            },
            data: { status: "rejected" },
        });
        return { message: "Offre acceptée avec succès et les autres offres ont été rejetées." };
    }
    async rejectOffer(quoteId) {
        return await this.prisma.quote.update({
            where: { id: quoteId },
            data: { status: "rejected" },
        });
    }
    async getOwnerChantiers(ownerId) {
        try {
            if (!ownerId) {
                throw new Error("L'ID du propriétaire est requis.");
            }
            const ownerAds = await this.prisma.ad.findMany({
                where: { ownerId: ownerId },
                select: { id: true }
            });
            if (!ownerAds.length) {
                throw new common_1.NotFoundException("Aucune annonce trouvée pour cet utilisateur.");
            }
            const adIds = ownerAds.map(ad => ad.id);
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
        }
        catch (error) {
            console.error("Erreur lors de la récupération des chantiers:", error);
            throw new Error('Erreur lors de la récupération des chantiers: ' + error.message);
        }
    }
    async acceptOfferAndCreateChantier(quoteId) {
        const selectedQuote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: { ad: true, company: true },
        });
        if (!selectedQuote) {
            throw new common_1.NotFoundException("Devis introuvable.");
        }
        const existingChantier = await this.prisma.chantier.findUnique({
            where: { adId: selectedQuote.adId },
        });
        if (existingChantier) {
            throw new Error("Ce projet a déjà été transformé en chantier.");
        }
        await this.prisma.quote.update({
            where: { id: quoteId },
            data: { status: "accepted" },
        });
        await this.prisma.quote.updateMany({
            where: {
                adId: selectedQuote.adId,
                id: { not: quoteId },
            },
            data: { status: "rejected" },
        });
        const chantier = await this.prisma.chantier.create({
            data: {
                adId: selectedQuote.adId,
                companyId: selectedQuote.company.id,
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
    async getChantierSteps(chantierId, ownerId) {
        const chantier = await this.prisma.chantier.findFirst({
            where: { id: chantierId, ad: { ownerId: ownerId } },
            include: { etapes: true },
        });
        if (!chantier) {
            throw new common_1.NotFoundException("Chantier introuvable ou non autorisé.");
        }
        return chantier.etapes.map(etape => ({
            id: etape.id,
            name: etape.name,
            details: typeof etape.details === "string" ? JSON.parse(etape.details) : etape.details,
            completed: etape.companyValidated,
            createdAt: etape.createdAt,
        }));
    }
};
exports.OwnerService = OwnerService;
exports.OwnerService = OwnerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OwnerService);
//# sourceMappingURL=owner.service.js.map