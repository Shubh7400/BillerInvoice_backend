import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schemas/invoice';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { User } from 'src/auth/schemas/user';
import { Project } from 'src/projects/schemas/project';
import { Client } from 'src/client/schemas/clients';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }
  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    // const { clientId, projects } = createInvoiceDto;
    // let amountBeforeGst = 0;
    // for (let i = 0; i < projects.length; i++) {
    //   const id = projects[i];
    //   const project = await this.projectModel.findById(id);
    //   amountBeforeGst = amountBeforeGst + project.amount;
    // }
    // const client = await this.clientModel.findById(clientId);
    // let cgst = 0;
    // let sgst = 0;
    // if (client.sameState) {
    //   cgst = 0.09 * amountBeforeGst;
    //   sgst = 0.09 * amountBeforeGst;
    // } else {
    //   cgst = 0.18 * amountBeforeGst;
    // }

    // const amountAfterGst = amountBeforeGst + cgst + sgst;

    // console.log({ ...createInvoiceDto });
    // console.log(user);
    // const data = {
    //   ...createInvoiceDto,
    //   invoiceNo: user.invoiceNo,
    //   adminId: user._id,
    //   amountAfterGst: +amountAfterGst.toFixed(2),
    //   amountBeforeGst: +amountBeforeGst.toFixed(2),
    //   cgst: +cgst.toFixed(2),
    //   sgst: +sgst.toFixed(2),
    // };
    try {
      const invoice = await this.invoiceModel.create(createInvoiceDto);

      const user = await this.userModel.findById(invoice.adminId);

      user.invoiceNo = user.invoiceNo + 1;
      user.save();

      return invoice;
    } catch (error) {
      throw new Error('error in creating invoice');
    }
  }
  async getAllInvoices(user: User) {
    try {
      const invoices = await this.invoiceModel.find({ adminId: user._id });
      return invoices;
    } catch (error) {
      return error;
    }
  }
  async getInvoiceById(id: string) {
    try {
      return await this.invoiceModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Invoice does not exists');
    }
  }

  async updateInvoice(id: string, updateInvoiceDto: Partial<CreateInvoiceDto>) {
    try {
      const invoice = await this.invoiceModel.findById(id);

      if (!invoice) {
        throw new NotFoundException('Invoice does not exist');
      }

      // Update the invoice fields
      Object.assign(invoice, updateInvoiceDto);

      await invoice.save();
      return invoice;
    } catch (error) {
      console.error('Error details:', error.message || error);
      throw new Error('Error updating invoice');
    }
  }



  async getInvoiceCountByYear(year: string, userId: string) {
    try {
      const counts = await this.invoiceModel.aggregate([
        {
          $match: {
            adminId: new Types.ObjectId(userId),
            billDate: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$billDate' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: '$_id',
            count: 1
          }
        },
        { $sort: { '_id': 1 } },
      ]);

      const monthlyCounts = Array(12).fill(0);

      counts.forEach(({ _id, count }) => {
        monthlyCounts[_id - 1] = count;
      });

      return { year: year, data: counts };
    } catch (error) {
      throw new NotFoundException('Unable to get invoice counts for the specified year.');
    }
  }

  async getProjectsByYearAndMonth(year: string, month: string, userId: string) {
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('User ID:', userId);

    try {
      const data = await this.invoiceModel.aggregate([
        {
          $match: {
            adminId: new Types.ObjectId(userId),
            billDate: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $lookup: {
            from: 'projects',
            localField: 'projectsId',
            foreignField: '_id',
            as: 'projects',
          },
        },
        {
          $unwind: {
            path: '$projects',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users', // Collection name for the users
            localField: 'adminId', // Field from the invoice model
            foreignField: '_id', // Field from the User model
            as: 'userData', // Resulting field
          },
        },
        {
          $unwind: {
            path: '$userData',
            preserveNullAndEmptyArrays: true,
          },
        },
        // Lookup client collection based on projects.clientId
        {
          $lookup: {
            from: 'clients',
            localField: 'projects.clientId',
            foreignField: '_id',
            as: 'clientData',
          },
        },
        {
          $unwind: {
            path: '$clientData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            invoiceId: '$_id',
            invoiceNo: 1,
            billDate: 1,
            dueDate: 1,
            amountWithoutTax: 1,
            amountAfterTax: 1,
            taxType:"",
            projectId: '$projects._id',
            projectName: '$projects.projectName',
            rate: '$projects.rate',
            projectManager: '$projects.projectManager',
            currencyType: '$projects.currencyType',
            workingPeriod: '$projects.workingPeriod',
            workingPeriodType: '$projects.workingPeriodType',
            conversionRate: '$projects.conversionRate',
            clientId: '$projects.clientId',
            ratePerDay: `$projects.ratePerDay`,
            advanceAmount: `$projects.advanceAmount`,
            amount: `$projects.amount`,
            // User details
            userId: '$userData._id',
            userEmail: '$userData.email',
            companyName: '$userData.companyName',
            gistin: '$userData.gistin',
            contactNo: '$userData.contactNo',
            pancardNo: '$userData.pancardNo',
            address: '$userData.address',
            invoiceNoUser: '$userData.invoiceNo',
            companyLogo: '$userData.companyLogo',
            accountNo: '$userData.accountNo',
            ifsc: '$userData.ifsc',
            bank: '$userData.bank',
            //  client details
            clientName: '$clientData.clientName',
            clientGstin: '$clientData.gistin',
            clientPanCard: '$clientData.pancardNo',
            clientAddress: '$clientData.address',
            sameState: '$clientData.sameState',
            clientEmails: '$clientData.email',

          },
        },
      ]);

      if (!data.length) {
        throw new NotFoundException('No invoices or projects found for the specified month and year.');
      }

      return {
        year,
        month,
        data,
        totalProjects: data.length,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch combined project and invoice data');
    }
  }

  async getInvoicesByDateRange(
    fromYear: string,
    fromMonth: string,
    toYear: string,
    toMonth: string,
    userId: string,
  ) {
    const fromDate = new Date(`${fromYear}-${fromMonth}-01`);
    const toDate = new Date(`${toYear}-${toMonth}-01`);
    toDate.setMonth(toDate.getMonth() + 1);

    try {
      const invoices = await this.invoiceModel.aggregate([
        {
          $match: {
            adminId: new Types.ObjectId(userId),
            billDate: {
              $gte: fromDate,
              $lt: toDate,
            },
          },
        },
        {
          $lookup: {
            from: 'projects',
            localField: 'projectsId',
            foreignField: '_id',
            as: 'projects',
          },
        },
        {
          $unwind: {
            path: '$projects',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users', // Collection name for the users
            localField: 'adminId', // Field from the invoice model
            foreignField: '_id', // Field from the User model
            as: 'userData', // Resulting field
          },
        },
        {
          $unwind: {
            path: '$userData',
            preserveNullAndEmptyArrays: true,
          },
        },
        // Lookup client collection based on projects.clientId
        {
          $lookup: {
            from: 'clients',
            localField: 'projects.clientId',
            foreignField: '_id',
            as: 'clientData',
          },
        },
        {
          $unwind: {
            path: '$clientData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            invoiceId: '$_id',
            invoiceNo: 1,
            billDate: 1,
            dueDate: 1,
            amountWithoutTax: 1,
            amountAfterTax: 1,
            projectId: '$projects._id',
            projectName: '$projects.projectName',
            rate: '$projects.rate',
            projectManager: '$projects.projectManager',
            currencyType: '$projects.currencyType',
            workingPeriod: '$projects.workingPeriod',
            workingPeriodType: '$projects.workingPeriodType',
            conversionRate: '$projects.conversionRate',
            clientId: '$projects.clientId',
            ratePerDay: `$projects.ratePerDay`,
            advanceAmount: `$projects.advanceAmount`,
            amount: `$projects.amount`,
            // User details
            userId: '$userData._id',
            userEmail: '$userData.email',
            companyName: '$userData.companyName',
            gistin: '$userData.gistin',
            contactNo: '$userData.contactNo',
            pancardNo: '$userData.pancardNo',
            address: '$userData.address',
            invoiceNoUser: '$userData.invoiceNo',
            companyLogo: '$userData.companyLogo',
            accountNo: '$userData.accountNo',
            ifsc: '$userData.ifsc',
            bank: '$userData.bank',
            //  client details
            clientName: '$clientData.clientName',
            clientGstin: '$clientData.gistin',
            clientPanCard: '$clientData.pancardNo',
            clientAddress: '$clientData.address',
            sameState: '$clientData.sameState',
            clientEmails: '$clientData.email',
            
          },
        },
      ]);

      return invoices;
    } catch (error) {
      throw new Error('Failed to fetch invoices by date range');
    }
  }
}