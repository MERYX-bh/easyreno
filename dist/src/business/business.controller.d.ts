import { BusinessService } from './business.service';
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        userType: string;
        companyId?: number;
    };
}
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    getAllAds(): Promise<({
        owner: {
            nom: string;
        };
        quotes: {
            status: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        ownerId: number;
        title: string;
        workArea: string;
        maxBudget: number;
    })[]>;
    getAdDetails(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        ownerId: number;
        title: string;
        workArea: string;
        maxBudget: number;
    }>;
    createQuote(req: any, adId: string, file: Express.Multer.File, data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: string;
        ownerId: number | null;
        companyId: number | null;
        title: string;
        price: number;
        fileUrl: string | null;
        duration: string;
        adId: number;
        projectId: number | null;
    }>;
    getQuotesByAd(adId: string): Promise<({
        company: {
            id: number;
            nomEntreprise: string;
            siret: string;
            email: string;
            motDePasse: string;
            adresse: string;
            complementAdresse: string | null;
            ville: string;
            codePostal: string;
            corpsEtat: string;
            autreCorpsEtat: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: string;
        ownerId: number | null;
        companyId: number | null;
        title: string;
        price: number;
        fileUrl: string | null;
        duration: string;
        adId: number;
        projectId: number | null;
    })[]>;
    getMyQuotes(req: any): Promise<({
        ad: {
            owner: {
                nom: string;
            };
            title: string;
            maxBudget: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: string;
        ownerId: number | null;
        companyId: number | null;
        title: string;
        price: number;
        fileUrl: string | null;
        duration: string;
        adId: number;
        projectId: number | null;
    })[] | {
        message: string;
    }>;
    convertToChantier(req: any, annonceId: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        companyId: number;
        adId: number;
    }>;
    addStep(chantierId: string, body: {
        stepName: string;
        details: string[];
    }, req: AuthenticatedRequest): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        completed: boolean;
        details: import("@prisma/client/runtime/library").JsonValue;
        chantierId: number;
        ownerValidated: boolean;
        companyValidated: boolean;
        reserve: string | null;
    }>;
    deleteChantier(chantierId: string): Promise<{
        message: string;
    }>;
    getSteps(chantierId: string): Promise<{
        completed: boolean;
        details: any;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        chantierId: number;
        ownerValidated: boolean;
        companyValidated: boolean;
        reserve: string | null;
    }[]>;
    validateStep(stepId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        completed: boolean;
        details: import("@prisma/client/runtime/library").JsonValue;
        chantierId: number;
        ownerValidated: boolean;
        companyValidated: boolean;
        reserve: string | null;
    }>;
    invalidateStep(stepId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        completed: boolean;
        details: import("@prisma/client/runtime/library").JsonValue;
        chantierId: number;
        ownerValidated: boolean;
        companyValidated: boolean;
        reserve: string | null;
    }>;
    checkCompletion(chantierId: string): Promise<boolean>;
    addReserve(stepId: string, body: {
        reserveText: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        completed: boolean;
        details: import("@prisma/client/runtime/library").JsonValue;
        chantierId: number;
        ownerValidated: boolean;
        companyValidated: boolean;
        reserve: string | null;
    }>;
    getAllChantiers(req: any): Promise<{
        id: number;
        title: string;
        startDate: Date;
        estimatedEndDate: any;
        budget: number;
        companyName: string;
        status: string;
        progress: number;
    }[]>;
}
export {};
