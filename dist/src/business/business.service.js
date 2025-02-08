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
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BusinessService = class BusinessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllAds() {
        return this.prisma.ad.findMany({
            where: {
                quotes: {
                    none: { status: "accepted" },
                },
            },
            include: {
                owner: { select: { nom: true } },
                quotes: { select: { status: true } },
            },
        });
    }
    async getAdDetails(id) {
        const ad = await this.prisma.ad.findUnique({
            where: { id },
        });
        if (!ad) {
            throw new common_1.NotFoundException(`Aucune annonce trouvée avec l'ID ${id}`);
        }
        return ad;
    }
    async createQuote(companyId, adId, data) {
        try {
            const ad = await this.prisma.ad.findUnique({
                where: { id: adId },
                select: { ownerId: true },
            });
            if (!ad) {
                throw new Error(`Annonce avec ID ${adId} introuvable.`);
            }
            if (!data.title || !data.price || !data.description) {
                throw new Error('Les champs title, price et description sont obligatoires.');
            }
            const priceFloat = parseFloat(data.price);
            if (isNaN(priceFloat)) {
                throw new Error('Le prix doit être un nombre valide.');
            }
            return await this.prisma.quote.create({
                data: {
                    title: data.title,
                    price: priceFloat,
                    description: data.description,
                    fileUrl: data.fileUrl || null,
                    status: "pending",
                    company: { connect: { id: companyId } },
                    ad: { connect: { id: adId } },
                    owner: { connect: { id: ad.ownerId } },
                },
            });
        }
        catch (error) {
            throw new Error(`Erreur lors de la création du devis: ${error.message}`);
        }
    }
    async getQuotesByAd(adId) {
        return this.prisma.quote.findMany({
            where: { adId: adId },
            include: { company: true },
        });
    }
    async getQuotesByCompany(companyId) {
        console.log("🔍 Debug - Récupération des devis pour companyId :", companyId);
        if (!companyId) {
            throw new common_1.UnauthorizedException("Utilisateur non autorisé");
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
    async transformAnnonceToChantier(annonceId, companyId) {
        const annonce = await this.prisma.ad.findUnique({
            where: { id: annonceId },
        });
        if (!annonce) {
            throw new common_1.NotFoundException("Annonce introuvable.");
        }
        const existingChantier = await this.prisma.chantier.findUnique({
            where: { adId: annonceId },
        });
        if (existingChantier) {
            throw new common_1.UnauthorizedException("Cette annonce est déjà un chantier.");
        }
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
    async addStep(chantierId, stepName, details) {
        const chantier = await this.prisma.chantier.findUnique({
            where: { id: chantierId },
        });
        if (!chantier) {
            throw new common_1.NotFoundException("Chantier introuvable.");
        }
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
    async getChantierSteps(chantierId) {
        const steps = await this.prisma.etape.findMany({
            where: { chantierId },
            orderBy: { id: 'asc' },
        });
        const formattedSteps = steps.map(step => ({
            ...step,
            completed: step.companyValidated ? true : false,
            details: typeof step.details === "string" ? JSON.parse(step.details) : step.details,
        }));
        console.log("✅ Étapes retournées au frontend :", formattedSteps);
        return formattedSteps;
    }
    async validateStep(stepId) {
        const step = await this.prisma.etape.findUnique({
            where: { id: stepId },
        });
        if (!step) {
            throw new common_1.NotFoundException("Étape introuvable.");
        }
        const updatedStep = await this.prisma.etape.update({
            where: { id: stepId },
            data: { companyValidated: true, completed: true },
        });
        console.log(`✅ Étape validée :`, updatedStep);
        return updatedStep;
    }
    async invalidateStep(stepId) {
        const step = await this.prisma.etape.findUnique({
            where: { id: stepId },
        });
        if (!step) {
            throw new common_1.NotFoundException("Étape introuvable.");
        }
        const updatedStep = await this.prisma.etape.update({
            where: { id: stepId },
            data: { companyValidated: false, completed: false },
        });
        console.log(`❌ Étape invalidée :`, updatedStep);
        return updatedStep;
    }
    async checkChantierCompletion(chantierId) {
        const chantier = await this.prisma.chantier.findUnique({
            where: { id: chantierId },
            include: { etapes: true },
        });
        if (!chantier) {
            throw new common_1.NotFoundException("Chantier introuvable.");
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
    async addReserve(stepId, reserveText) {
        const step = await this.prisma.etape.findUnique({
            where: { id: stepId },
        });
        if (!step) {
            throw new common_1.NotFoundException("Étape introuvable.");
        }
        const updatedStep = await this.prisma.etape.update({
            where: { id: stepId },
            data: {
                reserve: reserveText,
                completed: false,
            },
        });
        console.log("🚨 Réserve ajoutée :", updatedStep);
        return updatedStep;
    }
    async getAllChantiers() {
        return this.prisma.chantier.findMany({
            include: {
                ad: { select: { title: true, maxBudget: true, createdAt: true } },
                etapes: { select: { completed: true } },
                company: { select: { nomEntreprise: true } },
            },
        }).then(chantiers => chantiers.map(chantier => ({
            id: chantier.id,
            title: chantier.ad.title,
            startDate: chantier.ad.createdAt,
            estimatedEndDate: null,
            budget: chantier.ad.maxBudget,
            companyName: chantier.company.nomEntreprise,
            status: chantier.status,
            progress: chantier.etapes.length > 0
                ? Math.round((chantier.etapes.filter(e => e.completed).length / chantier.etapes.length) * 100)
                : 0,
        })));
    }
    async deleteChantier(chantierId) {
        const chantier = await this.prisma.chantier.findUnique({
            where: { id: chantierId },
        });
        if (!chantier) {
            throw new common_1.NotFoundException("Chantier introuvable.");
        }
        await this.prisma.etape.deleteMany({ where: { chantierId } });
        await this.prisma.chantier.delete({ where: { id: chantierId } });
        console.log("🏗️ Chantier supprimé avec succès !");
        return { message: "Chantier supprimé avec succès." };
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessService);
//# sourceMappingURL=business.service.js.map