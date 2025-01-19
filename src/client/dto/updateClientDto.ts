import {
  IsString,
  IsObject,
  IsNumber,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  ArrayNotEmpty,
  IsBoolean,
  IsIn
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
  pancardNo?: string;

  @IsString()
  @IsOptional()
  contactNo: string;

  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  email: string[];
  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive']) // Matches the enum in the schema
  isActive?: string;
}
