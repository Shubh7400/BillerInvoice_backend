import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { AuthModule } from 'src/auth/auth.module';
import { ClientModule } from 'src/client/client.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from './schemas/invoice';
import { Project, ProjectSchema } from 'src/projects/schemas/project';
import { Client, ClientSchema } from 'src/client/schemas/clients';
import { User, UserSchema } from 'src/auth/schemas/user';

@Module({
  imports: [
    AuthModule,
    ClientModule,
    ProjectsModule,
    MongooseModule.forFeature([{ name: 'Invoice', schema: InvoiceSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
