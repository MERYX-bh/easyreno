import { OwnerService } from './owner.service';
export declare class OwnerController {
    private readonly ownerService;
    constructor(ownerService: OwnerService);
    createAd(req: any, adData: any): Promise<{
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
    getOwnerAds(req: any): Promise<({
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
    getAdById(req: any, id: string): Promise<{
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
    deleteAd(req: any, id: string): Promise<{
        message: string;
    }>;
    getOffersForAd(req: any, adId: string): Promise<({
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
    acceptOfferAndCreateChantier(quoteId: string): Promise<{
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
    rejectOffer(quoteId: string): Promise<{
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
    getOwnerChantiers(req: any): Promise<({
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
    getChantierSteps(req: any, chantierId: string): Promise<{
        id: number;
        name: string;
        details: any;
        completed: boolean;
        createdAt: Date;
    }[]>;
}
