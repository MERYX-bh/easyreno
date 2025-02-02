import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';  
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async registerCompany(companyData: any) {
    console.log("📢 Données reçues:", companyData); // 🔍 Debug
  
    try {
      const { confirmationMotDePasse, accepterConditions, ...dataWithoutConfirmation } = companyData;
  
      console.log("📢 Données après nettoyage:", dataWithoutConfirmation); // 🔍 Debug
  
      const newCompany = await this.prisma.company.create({
        data: {
          ...dataWithoutConfirmation,
          motDePasse: await bcrypt.hash(dataWithoutConfirmation.motDePasse, 10),
          corpsEtat: dataWithoutConfirmation.corpsEtat.join(", "), // Assure que c'est une string
        }
      });
  
      console.log("✅ Entreprise enregistrée:", newCompany);
      return { message: "Inscription réussie !" };
  
    } catch (error) {
      console.error("❌ Erreur Prisma:", error);
      throw new Error("Erreur serveur: " + error.message);
    }
  }
  

  async registerOwner(ownerData: any) {
    try {
      // Vérifier si l'email existe déjà
      const existingOwner = await this.prisma.owner.findUnique({
        where: { email: ownerData.email },
      });

      if (existingOwner) {
        throw new BadRequestException("Cet email est déjà utilisé.");
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(ownerData.motDePasse, 10);

      // Création du Owner
      const newOwner = await this.prisma.owner.create({
        data: {
          nom: ownerData.nom,
          prenom: ownerData.prenom,
          email: ownerData.email,
          motDePasse: hashedPassword,
          adresse: ownerData.adresse,
          complementAdresse: ownerData.complementAdresse,
          ville: ownerData.ville,
          codePostal: ownerData.codePostal,
        },
      });

      return { message: "Inscription réussie !" };
    } catch (error) {
      console.error("❌ Erreur lors de l'inscription du propriétaire:", error);
      throw new BadRequestException("Erreur serveur: " + error.message);
    }
  }

  async getProjects() {
    return this.prisma.project.findMany({
      include: {
        tasks: true,
        employees: true,
      },
    });
  }

  async createQuote(quoteData: any) {
    return this.prisma.quote.create({
      data: quoteData,
    });
  }

  async getPlanning() {
    return this.prisma.project.findMany({
      include: {
        tasks: true,
        employees: true,
      },
    });
  }

  async updateTask(taskId: number, taskData: any) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: taskData,
    });
  }

  async getExchanges() {
    return this.prisma.exchange.findMany({
      include: {
        messages: true,
      },
    });
  }

  async createMessage(messageData: any) {
    return this.prisma.message.create({
      data: messageData,
    });
  }

  async getInvoices() {
    return this.prisma.invoice.findMany();
  }

  async createInvoice(invoiceData: any) {
    return this.prisma.invoice.create({
      data: invoiceData,
    });
  }

  async updateInvoice(invoiceId: number, invoiceData: any) {
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: invoiceData,
    });
  }
}

