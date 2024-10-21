import {
  IsString,
  IsObject,
  IsNumber,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class ClientDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  gistin: string;

  @IsString()
  @IsNotEmpty()
  contactNo: string;

  @IsString()
  @IsNotEmpty()
  pancardNo: string;

  @IsObject()
  @IsNotEmpty()
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  @IsNumber()
  @IsNotEmpty()
  conversionRate: number;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
