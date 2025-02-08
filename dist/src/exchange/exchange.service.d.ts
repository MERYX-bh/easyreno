import { PrismaService } from '../../prisma/prisma.service';
export declare class ExchangeService {
    private prisma;
    constructor(prisma: PrismaService);
    getOwnerExchanges(ownerId: number): Promise<({
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
        ownerId: number;
        companyId: number;
        quoteId: number | null;
    })[]>;
    getCompanyExchanges(companyId: number): Promise<({
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
        ownerId: number;
        companyId: number;
        quoteId: number | null;
    })[]>;
    getExchangeDetails(exchangeId: number): Promise<{
        company: {
            id: number;
            nomEntreprise: string;
        };
        owner: {
            id: number;
            nom: string;
        };
        messages: {
            id: number;
            fileUrl: string | null;
            exchangeId: number;
            sender: string;
            content: string;
            timestamp: Date;
        }[];
    } & {
        id: number;
        createdAt: Date;
        ownerId: number;
        companyId: number;
        quoteId: number | null;
    }>;
    sendMessageInExchange(exchangeId: number, userId: number, userRole: "owner" | "company", content: string, fileUrl?: string): Promise<{
        id: number;
        fileUrl: string | null;
        exchangeId: number;
        sender: string;
        content: string;
        timestamp: Date;
    }>;
    getCompanyQuotes(companyId: number): Promise<{
        id: number;
        title: string;
    }[]>;
    sendQuoteMessage(companyId: number, ownerId: number, quoteId: number, content: string): Promise<{
        id: number;
        fileUrl: string | null;
        exchangeId: number;
        sender: string;
        content: string;
        timestamp: Date;
    }>;
}
