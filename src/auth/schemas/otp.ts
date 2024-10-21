import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class OTP extends Document {
  @Prop()
  otp: string;

  @Prop({ required: true })
  userEmail: string;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
