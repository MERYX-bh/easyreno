import { PrismaService } from '../../prisma/prisma.service';
export declare class OwnerService {
    private prisma;
    constructor(prisma: PrismaService);
    createAd(ownerId: number, adData: any): Promise<{
        message: string;
        ad: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            location: string;
            ownerId: number;
            title: string;
            workArea: string;
            maxBudget: number;
        };
    }>;
    getOwnerAds(ownerId: number): Promise<({
        owner: {
            id: number;
            email: string;
            motDePasse: string;
            adresse: string;
            complementAdresse: string | null;
            ville: string;
            codePostal: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            prenom: string;
        };
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
    getAdById(adId: number): Promise<{
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
    deleteAd(adId: number): Promise<{
        message: string;
    }>;
    getOffersForAd(adId: number, ownerId: number): Promise<({
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
    acceptOffer(quoteId: number): Promise<{
        message: string;
    }>;
    rejectOffer(quoteId: number): Promise<{
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
    getOwnerChantiers(ownerId: number): Promise<({
        ad: {
            id: number;
            location: string;
            title: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        companyId: number;
        adId: number;
    })[]>;
    acceptOfferAndCreateChantier(quoteId: number): Promise<{
        message: string;
        chantier: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            companyId: number;
            adId: number;
        };
    }>;
    getChantierSteps(chantierId: number, ownerId: number): Promise<{
        id: number;
        name: string;
        details: any;
        completed: boolean;
        createdAt: Date;
    }[]>;
}
