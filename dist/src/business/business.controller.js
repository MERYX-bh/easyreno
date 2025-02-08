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
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const business_service_1 = require("./business.service");
const multer_1 = require("multer");
const path_1 = require("path");
let BusinessController = class BusinessController {
    constructor(businessService) {
        this.businessService = businessService;
    }
    async getAllAds() {
        return this.businessService.getAllAds();
    }
    async getAdDetails(id) {
        return this.businessService.getAdDetails(Number(id));
    }
    async createQuote(req, adId, file, data) {
        console.log('🔍 Fichier reçu:', file);
        const companyId = req.user.companyId;
        if (!companyId) {
            throw new common_1.BadRequestException("ID de l'entreprise introuvable.");
        }
        const fileUrl = file ? `/uploads/quotes/${file.filename}` : null;
        console.log("📂 Chemin du fichier enregistré:", file.path);
        return this.businessService.createQuote(Number(companyId), Number(adId), {
            ...data,
            fileUrl,
        });
    }
    async getQuotesByAd(adId) {
        return this.businessService.getQuotesByAd(Number(adId));
    }
    async getMyQuotes(req) {
        console.log("🔍 Debug - Utilisateur connecté :", req.user);
        if (!req.user || req.user.role !== 'company') {
            return { message: "Utilisateur non autorisé" };
        }
        const companyId = req.user.companyId;
        return this.businessService.getQuotesByCompany(companyId);
    }
    async convertToChantier(req, annonceId) {
        console.log("🔍 Transformation en chantier pour annonce :", annonceId);
        return this.businessService.transformAnnonceToChantier(Number(annonceId), req.user.companyId);
    }
    async addStep(chantierId, body, req) {
        console.log("🔍 Ajout d'une étape :", body.stepName);
        if (!body.stepName || !body.details || body.details.length === 0) {
            throw new common_1.BadRequestException("Les champs 'stepName' et 'details' sont obligatoires.");
        }
        return this.businessService.addStep(Number(chantierId), body.stepName, body.details);
    }
    async deleteChantier(chantierId) {
        console.log(`🚧 Suppression du chantier ID: ${chantierId}`);
        return this.businessService.deleteChantier(Number(chantierId));
    }
    async getSteps(chantierId) {
        return this.businessService.getChantierSteps(Number(chantierId));
    }
    async validateStep(stepId) {
        return this.businessService.validateStep(Number(stepId));
    }
    async invalidateStep(stepId) {
        return this.businessService.invalidateStep(Number(stepId));
    }
    async checkCompletion(chantierId) {
        return this.businessService.checkChantierCompletion(Number(chantierId));
    }
    async addReserve(stepId, body) {
        console.log("🚨 Ajout de réserve pour l'étape :", stepId);
        return this.businessService.addReserve(Number(stepId), body.reserveText);
    }
    async getAllChantiers(req) {
        return this.businessService.getAllChantiers();
    }
};
exports.BusinessController = BusinessController;
__decorate([
    (0, common_1.Get)('ads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getAllAds", null);
__decorate([
    (0, common_1.Get)('ads/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getAdDetails", null);
__decorate([
    (0, common_1.Post)('quote/:adId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/quotes',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `file-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('adId')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Get)('quotes/:adId'),
    __param(0, (0, common_1.Param)('adId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getQuotesByAd", null);
__decorate([
    (0, common_1.Get)('my-quotes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getMyQuotes", null);
__decorate([
    (0, common_1.Post)('/convert-to-chantier/:annonceId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('annonceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "convertToChantier", null);
__decorate([
    (0, common_1.Post)('/chantier/:chantierId/add-step'),
    __param(0, (0, common_1.Param)('chantierId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "addStep", null);
__decorate([
    (0, common_1.Delete)('chantier/:chantierId'),
    __param(0, (0, common_1.Param)('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "deleteChantier", null);
__decorate([
    (0, common_1.Get)('chantier/:chantierId/steps'),
    __param(0, (0, common_1.Param)('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getSteps", null);
__decorate([
    (0, common_1.Patch)('chantier/validate-step/:stepId'),
    __param(0, (0, common_1.Param)('stepId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "validateStep", null);
__decorate([
    (0, common_1.Patch)('chantier/invalidate-step/:stepId'),
    __param(0, (0, common_1.Param)('stepId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "invalidateStep", null);
__decorate([
    (0, common_1.Get)('/chantier/:chantierId/check-completion'),
    __param(0, (0, common_1.Param)('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "checkCompletion", null);
__decorate([
    (0, common_1.Patch)('/chantier/add-reserve/:stepId'),
    __param(0, (0, common_1.Param)('stepId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "addReserve", null);
__decorate([
    (0, common_1.Get)('chantiers'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getAllChantiers", null);
exports.BusinessController = BusinessController = __decorate([
    (0, common_1.Controller)('business'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [business_service_1.BusinessService])
], BusinessController);
//# sourceMappingURL=business.controller.js.map