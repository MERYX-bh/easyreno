import { Injectable, NotFoundException,UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExchangeService {
  constructor(private prisma: PrismaService) {}

  // ✅ Récupérer les échanges d'un propriétaire
  async getOwnerExchanges(ownerId: number) {
    return this.prisma.exchange.findMany({
      where: { ownerId },
      include: { company: true }, // Correction ici
    });
  }

  // ✅ Récupérer les échanges d'une entreprise
  async getCompanyExchanges(companyId: number) {
    return this.prisma.exchange.findMany({
      where: { companyId },
      include: { owner: true },
    });
  }
  async getExchangeDetails(exchangeId: number) {
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: { 
        owner: { select: { id: true, nom: true } },  
        company: { select: { id: true, nomEntreprise: true } },
        messages: true 
      },
    });
  
    if (!exchange) {
      throw new NotFoundException("Échange introuvable.");
    }
  
    // Vérifier les messages récupérés
    console.log("📩 Messages récupérés :", exchange);
  
    return exchange;
  }
  

  async sendMessageInExchange(
    exchangeId: number,
    userId: number,
    userRole: "owner" | "company",
    content: string,
    fileUrl?: string
  ) {
    console.log("🔍 Exchange ID:", exchangeId);
    console.log("🔍 User ID:", userId);
    console.log("🔍 User Role:", userRole);
  
    if (!exchangeId || isNaN(exchangeId)) {
      throw new NotFoundException('Exchange ID invalide.');
    }
  
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: { 
        owner: { select: { id: true, nom: true } }, 
        company: { select: { id: true, nomEntreprise: true } } 
      },
    });
  
    if (!exchange) {
      throw new NotFoundException("Échange introuvable.");
    }
  
    console.log("📩 Échange récupéré:", exchange);
  
    let sender: "owner" | "company" | null = null;
  
    // ✅ Vérification améliorée
    if (userRole === "owner" && exchange.owner.id === userId) {
      sender = "owner";
    } else if (userRole === "company" && exchange.company.id === userId) {
      sender = "company";
    } else {
      console.log("🚨 L'utilisateur ne correspond ni à l'owner ni à la company !");
      console.log("🔍 exchange.owner.id:", exchange.owner.id);
      console.log("🔍 exchange.company.id:", exchange.company.id);
      throw new UnauthorizedException("Vous n'êtes pas autorisé à envoyer un message.");
    }
  
    console.log(`✅ Expéditeur du message: ${sender}`);
  
    const newMessage = await this.prisma.message.create({
      data: {
        exchangeId,
        sender,
        content,
        fileUrl,
      },
    });
  
    console.log("✅ Message enregistré:", newMessage);
  
    return newMessage;
  }
  

  // ✅ Récupérer les devis d'une entreprise
  async getCompanyQuotes(companyId: number) {
    return this.prisma.quote.findMany({
      where: { companyId },
      select: { id: true, title: true },
    });
  }

  async sendQuoteMessage(companyId: number, ownerId: number, quoteId: number, content: string) {
    console.log("📨 Envoi de message avec devis", { companyId, ownerId, quoteId, content });

    // 🔍 Vérifier si le devis appartient bien à l'entreprise
    const quote = await this.prisma.quote.findUnique({
        where: { id: quoteId, companyId },
    });

    if (!quote) {
        throw new NotFoundException("❌ Devis introuvable ou non accessible.");
    }

    // 🔍 Vérifier si un échange existe déjà
    let exchange = await this.prisma.exchange.findFirst({
        where: { companyId, ownerId, quoteId },
    });

    if (!exchange) {
        console.log("⚡ Aucun échange existant, création d'un nouvel échange...");

        // ✅ Créer un nouvel échange AVANT d'envoyer le message
        exchange = await this.prisma.exchange.create({
            data: {
                companyId,
                ownerId,
                quoteId,
            },
        });

        console.log("✅ Nouvel échange créé :", exchange);
    } else {
        console.log("🔄 Échange existant trouvé :", exchange);
    }

    // ✅ Ajouter un message à l'échange (nouveau ou existant)
    const message = await this.prisma.message.create({
        data: {
            exchangeId: exchange.id,
            sender: "company",
            content,
        },
    });

    console.log("✅ Message ajouté à l'échange :", message);
    return message;
}

}
