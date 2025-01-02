import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty()
  projectName: string;

  // @IsOptional()
  // @IsString()
  // projectManager?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  rate?: number;

  @IsNumber()
  // @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  conversionRate: number;

  @IsMongoId()
  @IsNotEmpty()
  adminId: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
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
  @Transform(({ value }) => parseFloat(value))
  projectPeriod?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  ratePerDay?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  advanceAmount?: number; 

  // New fields added
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
  endDate?: string;

  @IsOptional()
  @IsString({ each: true })
  fileUrls?: string[];
}

