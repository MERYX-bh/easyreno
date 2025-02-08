import { ExchangeService } from './exchange.service';
export declare class ExchangeController {
    private readonly exchangeService;
    constructor(exchangeService: ExchangeService);
    getOwnerExchanges(req: any): Promise<({
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
    getCompanyExchanges(req: any): Promise<({
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
    getExchangeDetails(exchangeId: string): Promise<{
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
    sendMessage(req: any, exchangeId: string, body: {
        content: string;
        fileUrl?: string;
    }): Promise<{
        id: number;
        fileUrl: string | null;
        exchangeId: number;
        sender: string;
        content: string;
        timestamp: Date;
    }>;
    getCompanyQuotes(req: any): Promise<{
        id: number;
        title: string;
    }[]>;
    sendQuoteMessage(req: any, body: {
        ownerId: number;
        quoteId: number;
        content: string;
    }): Promise<{
        id: number;
        fileUrl: string | null;
        exchangeId: number;
        sender: string;
        content: string;
        timestamp: Date;
    }>;
}
