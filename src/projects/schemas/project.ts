import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schemas/user';
import { Client } from 'src/client/schemas/clients';
@Schema({ timestamps: true })
export class Project extends Document {
  @Prop()
  projectName: string;
  @Prop()
  rate: number;
  @Prop()
  projectManager: string;
  @Prop()
  description: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  adminId: User;
  @Prop()
  workingPeriodType: 'hours' | 'days';
  @Prop()
  workingPeriod: string;
  @Prop()
  conversionRate: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  clientId: Client;
  @Prop()
  amount: number;
  @Prop()
  paymentStatus: string;
  @Prop()
  currencyType: 'rupees' | 'dollars' | 'pounds';
  @Prop()
  projectPeriod: number;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
