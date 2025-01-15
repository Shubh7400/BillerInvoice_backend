import { IsDateString, IsMongoId, IsNotEmpty, IsNumber ,IsOptional,IsString,IsObject} from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  invoiceNo: number;

  @IsDateString()
  @IsNotEmpty()
  billDate: Date;

  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @IsMongoId()
  @IsNotEmpty()
  clientId: string; // Assuming that the client's ID will be sent as a string

  @IsMongoId()
  @IsNotEmpty()
  adminId: string;

  @IsMongoId({ each: true })
  // @ValidateNested({ each: true })
  // @Type(() => String)
  projectsId: string[]; // Assuming that an array of project IDs will be sent as string

  @IsNumber()
  @IsNotEmpty()
  amountWithoutTax: number;

  @IsNumber()
  @IsNotEmpty()
  amountAfterTax: number;

  @IsOptional()
  @IsNumber()
  workingPeriod?: number;
  @IsOptional()
  @IsNumber()
  actualDays?: number;

  @IsOptional()
  @IsNumber()
  sacNo?: number;

  @IsNumber()
  @IsNotEmpty()
  conversionRate: number;

  @IsNotEmpty()
  projectName: string;

  @IsNotEmpty()
  resumeName: string;

  // @IsOptional()
  // @IsString()
  // projectManager?: string;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  workingPeriodType?: 'hours' | 'months' |'fixed';

  // @IsNotEmpty()
  // paymentStatus: boolean;
   @IsOptional()
  paymentStatus: boolean;

  @IsOptional()
  currencyType?: 'rupees' | 'dollars' | 'pounds';
  @IsOptional()
  description?: string;
  @IsOptional()
  projectPeriod?: number;
  @IsOptional()
  ratePerDay?: number;

  @IsOptional()
  @IsNumber()
  advanceAmount?: number;

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
  // clientDetails: {
  //   clientName: string;
  //   contactNo: string;
  //   gistin: string;
  //   pancardNo: string;
  //   address: object;
  //   email: string[];
  // };

  // @IsObject()
  // adminDetails: {
  //   email: string;
  //   companyName: string;
  //   gistin: string;
  //   contactNo: string;
  //   pancardNo: string;
  //   address: object;
  //   companyLogo: string;
  //   accountNo: string;
  //   ifsc: string;
  //   bank: string;
  // };

}
