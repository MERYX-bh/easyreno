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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const exchange_service_1 = require("./exchange.service");
let ExchangeController = class ExchangeController {
    constructor(exchangeService) {
        this.exchangeService = exchangeService;
    }
    async getOwnerExchanges(req) {
        console.log("🔍 Utilisateur connecté :", req.user);
        if (!req.user) {
            throw new common_1.UnauthorizedException("Utilisateur non authentifié");
        }
        return this.exchangeService.getOwnerExchanges(req.user.id);
    }
    async getCompanyExchanges(req) {
        console.log("🔍 Fetching exchanges for companyId:", req.user.companyId);
        const exchanges = await this.exchangeService.getCompanyExchanges(req.user.companyId);
        console.log("📩 Fetched Exchanges:", exchanges);
        return Array.isArray(exchanges) ? exchanges : [];
    }
    async getExchangeDetails(exchangeId) {
        return this.exchangeService.getExchangeDetails(Number(exchangeId));
    }
    async sendMessage(req, exchangeId, body) {
        console.log("🔍 Utilisateur authentifié :", req.user);
        return this.exchangeService.sendMessageInExchange(Number(exchangeId), req.user.id, req.user.role, body.content, body.fileUrl);
    }
    async getCompanyQuotes(req) {
        return this.exchangeService.getCompanyQuotes(req.user.companyId);
    }
    async sendQuoteMessage(req, body) {
        console.log("📩 Message reçu:", { companyId: req.user.companyId, ...body });
        return this.exchangeService.sendQuoteMessage(req.user.companyId, body.ownerId, body.quoteId, body.content);
    }
};
exports.ExchangeController = ExchangeController;
__decorate([
    (0, common_1.Get)('/owner'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getOwnerExchanges", null);
__decorate([
    (0, common_1.Get)('/company'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getCompanyExchanges", null);
__decorate([
    (0, common_1.Get)('/:exchangeId'),
    __param(0, (0, common_1.Param)('exchangeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getExchangeDetails", null);
__decorate([
    (0, common_1.Post)('/message/:exchangeId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('exchangeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('/company/quotes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getCompanyQuotes", null);
__decorate([
    (0, common_1.Post)('/company/message'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "sendQuoteMessage", null);
exports.ExchangeController = ExchangeController = __decorate([
    (0, common_1.Controller)('exchange'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [exchange_service_1.ExchangeService])
], ExchangeController);
//# sourceMappingURL=exchange.controller.js.map