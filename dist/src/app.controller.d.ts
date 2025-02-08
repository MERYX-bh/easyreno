import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    registerCompany(companyData: any): Promise<{
        message: string;
    }>;
    registerOwner(ownerData: any): Promise<{
        message: string;
    }>;
    getProjects(): Promise<({
        tasks: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            projectId: number;
            completed: boolean;
            date: Date;
            delayed: boolean;
        }[];
        employees: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        projectTitle: string;
        description: string;
        location: string;
        startDate: Date;
        endDate: Date;
        status: string;
        budget: number;
        ownerId: number;
        companyId: number | null;
    })[]>;
    createQuote(quoteData: any): Promise<{
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
    getPlanning(): Promise<({
        tasks: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            projectId: number;
            completed: boolean;
            date: Date;
            delayed: boolean;
        }[];
        employees: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        projectTitle: string;
        description: string;
        location: string;
        startDate: Date;
        endDate: Date;
        status: string;
        budget: number;
        ownerId: number;
        companyId: number | null;
    })[]>;
    updateTask(id: string, taskData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        projectId: number;
        completed: boolean;
        date: Date;
        delayed: boolean;
    }>;
    getExchanges(): Promise<({
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
    })[]>;
    createMessage(messageData: any): Promise<{
        id: number;
        fileUrl: string | null;
        exchangeId: number;
        sender: string;
        content: string;
        timestamp: Date;
    }>;
    getInvoices(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        projectTitle: string;
        status: string;
        companyId: number;
        projectId: number;
        date: Date;
        amount: number;
        details: string | null;
    }[]>;
    updateInvoice(id: string, invoiceData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        projectTitle: string;
        status: string;
        companyId: number;
        projectId: number;
        date: Date;
        amount: number;
        details: string | null;
    }>;
}
