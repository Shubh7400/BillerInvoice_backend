import { IsDateString, IsMongoId, IsNumber, IsOptional,IsString } from 'class-validator';

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

  @IsString()
  @IsOptional()
  taxType?: string; 
}
