import { IsDateString, IsMongoId, IsNumber, IsOptional, IsString, IsNotEmpty, IsObject } from 'class-validator';

export class UpdateInvoiceDto {
  @IsNumber()
  @IsOptional()
  invoiceNo?: number;

  @IsDateString()
  @IsOptional()
  billDate?: Date;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsMongoId()
  @IsOptional()
  clientId?: string; // Optional because it might not always be updated

  @IsMongoId()
  @IsOptional()
  adminId?: string;

  @IsMongoId({ each: true })
  @IsOptional()
  projectsId?: string[]; // Optional for partial updates

  @IsNumber()
  @IsOptional()
  amountWithoutTax?: number;

  @IsNumber()
  @IsOptional()
  amountAfterTax?: number;

  @IsOptional()
  @IsNumber()
  workingPeriod?: number;

  @IsNumber()
  @IsNotEmpty()
  conversionRate: number;

  @IsOptional()
  @IsNotEmpty()
  projectName?: string;

  @IsOptional()
  projectManager?: string;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  workingPeriodType?: 'hours' | 'months' | 'fixed';

  @IsOptional()
  paymentStatus?: boolean;

  @IsOptional()
  currencyType?: 'rupees' | 'dollars' | 'pounds';
  @IsOptional()
  description: string;
  @IsOptional()
  projectPeriod: number;
  @IsOptional()
  ratePerDay: number;
  @IsOptional()
  @IsNumber()
  advanceAmount?: number; // Add advance amount field

  @IsOptional()
  @IsNumber()
  sacNo?: number;
  @IsOptional()
  @IsNumber()
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  grandTotal?: number;

  @IsOptional()
  @IsString()
  taxType?: string;

  // Additional fields to hold client and admin details
  // @IsObject()
  clientDetails: {
    clientName: string;
    contactNo: string;
    gistin: string;
    pancardNo: string;
    address: object;
    email: string[];
  };

  // @IsObject()
  adminDetails: {
    email: string;
    companyName: string;
    gistin: string;
    contactNo: string;
    pancardNo: string;
    address: object;
    companyLogo: string;
    accountNo: string;
    ifsc: string;
    bank: string;
  };


}
