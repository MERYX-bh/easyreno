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
exports.OwnerController = void 0;
const common_1 = require("@nestjs/common");
const owner_service_1 = require("./owner.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let OwnerController = class OwnerController {
    constructor(ownerService) {
        this.ownerService = ownerService;
    }
    async createAd(req, adData) {
        console.log('Utilisateur connecté:', req.user);
        return this.ownerService.createAd(req.user.id, adData);
    }
    async getOwnerAds(req) {
        return this.ownerService.getOwnerAds(req.user.id);
    }
    async getAdById(req, id) {
        console.log(`Récupération de l'annonce avec l'ID: ${id}`);
        return this.ownerService.getAdById(Number(id));
    }
    async deleteAd(req, id) {
        console.log(`Suppression de l'annonce avec l'ID: ${id}`);
        return this.ownerService.deleteAd(Number(id));
    }
    async getOffersForAd(req, adId) {
        const ownerId = req.user.id;
        return this.ownerService.getOffersForAd(Number(adId), ownerId);
    }
    async acceptOfferAndCreateChantier(quoteId) {
        return this.ownerService.acceptOfferAndCreateChantier(Number(quoteId));
    }
    async rejectOffer(quoteId) {
        return this.ownerService.rejectOffer(Number(quoteId));
    }
    async getOwnerChantiers(req) {
        const ownerId = req.user.id;
        return this.ownerService.getOwnerChantiers(ownerId);
    }
    async getChantierSteps(req, chantierId) {
        const ownerId = req.user.id;
        return this.ownerService.getChantierSteps(Number(chantierId), ownerId);
    }
};
exports.OwnerController = OwnerController;
__decorate([
    (0, common_1.Post)('create-ad'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "createAd", null);
__decorate([
    (0, common_1.Get)('ads'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getOwnerAds", null);
__decorate([
    (0, common_1.Get)('ads/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getAdById", null);
__decorate([
    (0, common_1.Delete)('ads/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "deleteAd", null);
__decorate([
    (0, common_1.Get)('ad/:adId/offers'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getOffersForAd", null);
__decorate([
    (0, common_1.Post)('quote/:quoteId/accept'),
    __param(0, (0, common_1.Param)('quoteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "acceptOfferAndCreateChantier", null);
__decorate([
    (0, common_1.Post)('quote/:quoteId/reject'),
    __param(0, (0, common_1.Param)('quoteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "rejectOffer", null);
__decorate([
    (0, common_1.Get)('chantiers'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getOwnerChantiers", null);
__decorate([
    (0, common_1.Get)('chantier/:chantierId/steps'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getChantierSteps", null);
exports.OwnerController = OwnerController = __decorate([
    (0, common_1.Controller)('owner'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [owner_service_1.OwnerService])
], OwnerController);
//# sourceMappingURL=owner.controller.js.map