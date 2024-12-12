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

  // @IsOptional()
  // @IsString()
  // workingPeriod?: string;

  @IsOptional()
  workingPeriodType?: 'hours' | 'months';

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
