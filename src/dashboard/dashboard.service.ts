import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from 'src/client/schemas/clients';
import { Project } from 'src/projects/schemas/project';
import { Invoice } from 'src/invoice/schemas/invoice';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async findAllData() {
    try {
      const clients = await this.clientModel.countDocuments().exec();
      const projects = await this.projectModel.countDocuments().exec();
      const invoices = await this.invoiceModel.countDocuments().exec();

      return {
        totalClients: clients,
        totalProjects: projects,
        totalInvoices: invoices,
      };
    } catch (error) {
      return error;
    }
  }
}
