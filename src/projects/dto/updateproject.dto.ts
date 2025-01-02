import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProjectDto {
  @IsOptional()
  @IsNotEmpty()
  projectName?: string;

  @IsOptional()
  projectManager?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  rate?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  conversionRate?: number;

  @IsMongoId()
  @IsOptional()
  adminId?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  workingPeriod?: number;

  @IsOptional()
  workingPeriodType?: 'hours' | 'months'|'fixed';

  @IsMongoId()
  @IsOptional()
  clientId?: string;

  @IsOptional()
  paymentStatus?: boolean;

  @IsOptional()
  currencyType?: 'rupees' | 'dollars' | 'pounds';
  @IsOptional()
  description: string;
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  projectPeriod: number;
  @IsOptional()
  ratePerDay: number;
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  advanceAmount?: number; 

  @IsOptional()
  @IsString()
  paymentCycle?: string;

  @IsOptional()
  @IsString()
  billingCycle?: 'hours' | 'months' | 'fixed';

  @IsOptional()
  @IsString()
  technology?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  paidLeave?: number;

  
  @IsOptional()
  @IsString()
  timeSheet?: string;

  @IsOptional()
  @IsString()
  candidateName?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;@IsOptional()
  // @IsArray()
  @IsString({ each: true })
  fileUrls?: string[];


}
