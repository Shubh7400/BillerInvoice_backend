import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsNotEmpty()
  projectName?: string;

  @IsOptional()
  projectManager?: string;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsNumber()
  @IsOptional()
  conversionRate?: number;

  @IsMongoId()
  @IsOptional()
  adminId?: string;

  @IsOptional()
  @IsString()
  workingPeriod?: string;

  @IsOptional()
  workingPeriodType?: 'hours' | 'days';

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
  projectPeriod: number;
}
