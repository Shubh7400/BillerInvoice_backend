import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray
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
  // @IsNotEmpty()
  @IsOptional()
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
  @IsArray()
  @IsString({ each: true })
  fileUrls?: string[];
}
