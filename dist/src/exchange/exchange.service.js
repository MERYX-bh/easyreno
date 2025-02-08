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
exports.ExchangeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ExchangeService = class ExchangeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOwnerExchanges(ownerId) {
        return this.prisma.exchange.findMany({
            where: { ownerId },
            include: { company: true },
        });
    }
    async getCompanyExchanges(companyId) {
        return this.prisma.exchange.findMany({
            where: { companyId },
            include: { owner: true },
        });
    }
    async getExchangeDetails(exchangeId) {
        const exchange = await this.prisma.exchange.findUnique({
            where: { id: exchangeId },
            include: {
                owner: { select: { id: true, nom: true } },
                company: { select: { id: true, nomEntreprise: true } },
                messages: true
            },
        });
        if (!exchange) {
            throw new common_1.NotFoundException("Échange introuvable.");
        }
        console.log("📩 Messages récupérés :", exchange);
        return exchange;
    }
    async sendMessageInExchange(exchangeId, userId, userRole, content, fileUrl) {
        console.log("🔍 Exchange ID:", exchangeId);
        console.log("🔍 User ID:", userId);
        console.log("🔍 User Role:", userRole);
        if (!exchangeId || isNaN(exchangeId)) {
            throw new common_1.NotFoundException('Exchange ID invalide.');
        }
        const exchange = await this.prisma.exchange.findUnique({
            where: { id: exchangeId },
            include: {
                owner: { select: { id: true, nom: true } },
                company: { select: { id: true, nomEntreprise: true } }
            },
        });
        if (!exchange) {
            throw new common_1.NotFoundException("Échange introuvable.");
        }
        console.log("📩 Échange récupéré:", exchange);
        let sender = null;
        if (userRole === "owner" && exchange.owner.id === userId) {
            sender = "owner";
        }
        else if (userRole === "company" && exchange.company.id === userId) {
            sender = "company";
        }
        else {
            console.log("🚨 L'utilisateur ne correspond ni à l'owner ni à la company !");
            console.log("🔍 exchange.owner.id:", exchange.owner.id);
            console.log("🔍 exchange.company.id:", exchange.company.id);
            throw new common_1.UnauthorizedException("Vous n'êtes pas autorisé à envoyer un message.");
        }
        console.log(`✅ Expéditeur du message: ${sender}`);
        const newMessage = await this.prisma.message.create({
            data: {
                exchangeId,
                sender,
                content,
                fileUrl,
            },
        });
        console.log("✅ Message enregistré:", newMessage);
        return newMessage;
    }
    async getCompanyQuotes(companyId) {
        return this.prisma.quote.findMany({
            where: { companyId },
            select: { id: true, title: true },
        });
    }
    async sendQuoteMessage(companyId, ownerId, quoteId, content) {
        console.log("📨 Envoi de message avec devis", { companyId, ownerId, quoteId, content });
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId, companyId },
        });
        if (!quote) {
            throw new common_1.NotFoundException("❌ Devis introuvable ou non accessible.");
        }
        let exchange = await this.prisma.exchange.findFirst({
            where: { companyId, ownerId, quoteId },
        });
        if (!exchange) {
            console.log("⚡ Aucun échange existant, création d'un nouvel échange...");
            exchange = await this.prisma.exchange.create({
                data: {
                    companyId,
                    ownerId,
                    quoteId,
                },
            });
            console.log("✅ Nouvel échange créé :", exchange);
        }
        else {
            console.log("🔄 Échange existant trouvé :", exchange);
        }
        const message = await this.prisma.message.create({
            data: {
                exchangeId: exchange.id,
                sender: "company",
                content,
            },
        });
        console.log("✅ Message ajouté à l'échange :", message);
        return message;
    }
};
exports.ExchangeService = ExchangeService;
exports.ExchangeService = ExchangeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExchangeService);
//# sourceMappingURL=exchange.service.js.map