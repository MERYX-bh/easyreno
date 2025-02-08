import { PrismaService } from '../../prisma/prisma.service';
export declare class BusinessService {
    private prisma;
    constructor(prisma: PrismaService);
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
    sss: any;
    getAdDetails(id: number): Promise<{
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
    createQuote(companyId: number, adId: number, data: any): Promise<{
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
    getQuotesByAd(adId: number): Promise<({
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
    getQuotesByCompany(companyId: number): Promise<({
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
    })[]>;
    transformAnnonceToChantier(annonceId: number, companyId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        companyId: number;
        adId: number;
    }>;
    addStep(chantierId: number, stepName: string, details: string[]): Promise<{
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
    getChantierSteps(chantierId: number): Promise<{
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
    checkChantierCompletion(chantierId: number): Promise<boolean>;
    addReserve(stepId: number, reserveText: string): Promise<{
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
    getAllChantiers(): Promise<{
        id: number;
        title: string;
        startDate: Date;
        estimatedEndDate: any;
        budget: number;
        companyName: string;
        status: string;
        progress: number;
    }[]>;
    deleteChantier(chantierId: number): Promise<{
        message: string;
    }>;
}
