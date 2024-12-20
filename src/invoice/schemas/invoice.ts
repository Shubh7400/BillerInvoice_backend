import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, Document, SchemaTypes } from 'mongoose';
import { User } from 'src/auth/schemas/user';
import { Client } from 'src/client/schemas/clients';
import { Project } from 'src/projects/schemas/project';
@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop()
  invoiceNo: number;
  @Prop({ type: SchemaTypes.Date }) // Specify the data type as SchemaTypes.Date
  billDate: Date;
  @Prop({ type: SchemaTypes.Date }) // Specify the data type as SchemaTypes.Date
  dueDate: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  clientId: Client;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  adminId: User;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
  projectsId: Project[];
  @Prop()
  amountWithoutTax: number;
  @Prop()
  amountAfterTax: number;

  // for project
  @Prop()
  projectName: string;
  @Prop()
  rate: number;
  // @Prop()
  // projectManager: string;
  @Prop()
  description: string;
  @Prop()
  workingPeriodType: 'hours' | 'months'|'fixed';
  @Prop()
  workingPeriod: number;
  @Prop()
  conversionRate: number;
  @Prop()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  amount: number;
  @Prop()
  advanceAmount: number; 
  @Prop()
  paymentStatus: string;
  @Prop()
  currencyType: 'rupees' | 'dollars' | 'pounds';
  @Prop()
  projectPeriod: number;
  @Prop()
  ratePerDay: number;
  @Prop()
  taxAmount: number;
  @Prop()
  grandTotal: number;
  @Prop()
  taxType: "cgst" | "igst" | "sgst";
}
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
