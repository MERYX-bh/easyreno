import { Controller, Get, Post, Put, Body, Param, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('register/company')
  registerCompany(@Body() companyData: any) {
    return this.appService.registerCompany(companyData);
  }

  @Post('register/owner')
  async registerOwner(@Body() ownerData: any) {
    if (!ownerData.nom || !ownerData.prenom || !ownerData.email || !ownerData.motDePasse) {
      throw new BadRequestException("Tous les champs requis doivent être remplis.");
    }
    return this.appService.registerOwner(ownerData);
  }

  @Get('projects')
  getProjects() {
    return this.appService.getProjects();
  }

  @Post('quotes')
  createQuote(@Body() quoteData: any) {
    return this.appService.createQuote(quoteData);
  }

  @Get('planning')
  getPlanning() {
    return this.appService.getPlanning();
  }

  @Put('tasks/:id')
  updateTask(@Param('id') id: string, @Body() taskData: any) {
    return this.appService.updateTask(parseInt(id), taskData);
  }

  @Get('exchanges')
  getExchanges() {
    return this.appService.getExchanges();
  }

  @Post('messages')
  createMessage(@Body() messageData: any) {
    return this.appService.createMessage(messageData);
  }

  @Get('invoices')
  getInvoices() {
    return this.appService.getInvoices();
  }

  @Put('invoices/:id')
  updateInvoice(@Param('id') id: string, @Body() invoiceData: any) {
    return this.appService.updateInvoice(parseInt(id), invoiceData);
  }
}