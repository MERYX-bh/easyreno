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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AppService = class AppService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerCompany(companyData) {
        console.log("📢 Données reçues:", companyData);
        try {
            const { confirmationMotDePasse, accepterConditions, ...dataWithoutConfirmation } = companyData;
            console.log("📢 Données après nettoyage:", dataWithoutConfirmation);
            const newCompany = await this.prisma.company.create({
                data: {
                    ...dataWithoutConfirmation,
                    motDePasse: await bcrypt.hash(dataWithoutConfirmation.motDePasse, 10),
                    corpsEtat: dataWithoutConfirmation.corpsEtat.join(", "),
                }
            });
            console.log("✅ Entreprise enregistrée:", newCompany);
            return { message: "Inscription réussie !" };
        }
        catch (error) {
            console.error("❌ Erreur Prisma:", error);
            throw new Error("Erreur serveur: " + error.message);
        }
    }
    async registerOwner(ownerData) {
        try {
            const existingOwner = await this.prisma.owner.findUnique({
                where: { email: ownerData.email },
            });
            if (existingOwner) {
                throw new common_1.BadRequestException("Cet email est déjà utilisé.");
            }
            const hashedPassword = await bcrypt.hash(ownerData.motDePasse, 10);
            const newOwner = await this.prisma.owner.create({
                data: {
                    nom: ownerData.nom,
                    prenom: ownerData.prenom,
                    email: ownerData.email,
                    motDePasse: hashedPassword,
                    adresse: ownerData.adresse,
                    complementAdresse: ownerData.complementAdresse,
                    ville: ownerData.ville,
                    codePostal: ownerData.codePostal,
                },
            });
            return { message: "Inscription réussie !" };
        }
        catch (error) {
            console.error("❌ Erreur lors de l'inscription du propriétaire:", error);
            throw new common_1.BadRequestException("Erreur serveur: " + error.message);
        }
    }
    async getProjects() {
        return this.prisma.project.findMany({
            include: {
                tasks: true,
                employees: true,
            },
        });
    }
    async createQuote(quoteData) {
        return this.prisma.quote.create({
            data: quoteData,
        });
    }
    async getPlanning() {
        return this.prisma.project.findMany({
            include: {
                tasks: true,
                employees: true,
            },
        });
    }
    async updateTask(taskId, taskData) {
        return this.prisma.task.update({
            where: { id: taskId },
            data: taskData,
        });
    }
    async getExchanges() {
        return this.prisma.exchange.findMany({
            include: {
                messages: true,
            },
        });
    }
    async createMessage(messageData) {
        return this.prisma.message.create({
            data: messageData,
        });
    }
    async getInvoices() {
        return this.prisma.invoice.findMany();
    }
    async createInvoice(invoiceData) {
        return this.prisma.invoice.create({
            data: invoiceData,
        });
    }
    async updateInvoice(invoiceId, invoiceData) {
        return this.prisma.invoice.update({
            where: { id: invoiceId },
            data: invoiceData,
        });
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map