import {
  IsString,
  IsObject,
  IsNumber,
  IsOptional,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  clientName?: string;

  @IsOptional()
  @IsString()
  gistin?: string;

  @IsOptional()
  @IsString()
  contactNo?: string;

  @IsOptional()
  @IsString()
  pancardNo?: string;

  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @IsOptional()
  @IsNumber()
  conversionRate?: number;
  @IsEmail()
  @IsOptional()
  email?: string;
}
