import {
  IsString,
  IsObject,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  ArrayNotEmpty,
  IsOptional,
  isString,
  IsBoolean,
  IsIn
} from 'class-validator';

export class ClientDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  gistin: string;

  @IsString()
  @IsOptional()
  pancardNo: string;

  @IsString()
  @IsOptional()
  contactNo: string;

  @IsObject()
  @IsNotEmpty()
  address: {
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
