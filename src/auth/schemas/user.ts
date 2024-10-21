import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: [true, 'duplicate email entered'] })
  email: string;
  @Prop()
  password: string;
  @Prop()
  companyName: string;
  @Prop()
  gistin: string;
  @Prop()
  contactNo: string;
  @Prop()
  pancardNo: string;
  @Prop({ type: Object })
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  @Prop()
  invoiceNo: number;
  @Prop()
  companyLogo: string;
  @Prop()
  accountNo: string;
  @Prop()
  ifsc: string;
  @Prop()
  bank: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
