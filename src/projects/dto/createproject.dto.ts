import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  projectName: string;

  // @IsOptional()
  // @IsString()
  // projectManager?: string;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsNumber()
  @IsNotEmpty()
  conversionRate: number;

  @IsMongoId()
  @IsNotEmpty()
  adminId: string;

  @IsOptional()
  @IsNumber()
  workingPeriod?: number;

  @IsOptional()
  workingPeriodType?: 'hours' | 'months' |'fixed';

  @IsMongoId()
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
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
  advanceAmount?: number; // Add advance amount field
}
