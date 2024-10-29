import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientModule } from 'src/client/client.module';
import { Client, ClientSchema } from 'src/client/schemas/clients';
import { Project, ProjectSchema } from 'src/projects/schemas/project';
import { Invoice, InvoiceSchema } from 'src/invoice/schemas/invoice';

import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from 'src/projects/projects.module';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [
    AuthModule,
    ClientModule,
    ProjectsModule,
    InvoiceModule,
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
