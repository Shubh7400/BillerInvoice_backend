import { IsDateString, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

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
}
