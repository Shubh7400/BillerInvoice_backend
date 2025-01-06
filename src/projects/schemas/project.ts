import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schemas/user';
import { Client } from 'src/client/schemas/clients';
@Schema({ timestamps: true, collection: 'projects' })
export class Project extends Document {
  @Prop()
  projectName: string;
  @Prop()
  rate: number;
  // @Prop()
  // projectManager: string;
  @Prop()
  description: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  adminId: User;
  @Prop()
  workingPeriodType: 'hours' | 'months'|'fixed';
  @Prop()
  workingPeriod: number;
  @Prop()
  conversionRate: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  clientId: Client;
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
   paymentCycle: string;
 
   @Prop()
   billingCycle: 'hours' | 'months' | 'fixed';
 
   @Prop()
   technology: string;
 
   @Prop()
   paidLeave: number;
 
   @Prop()
   timeSheet: string;
 
   @Prop()
   candidateName: string;
 
   @Prop()
   startDate: string;
 
   @Prop()
   endDate: string;

   @Prop({
    type: [
      {
        filename: String,
        url: String,
      },
    ],
  })
  uploadedFiles: {
    filename: string;
    url: string;
  }[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
