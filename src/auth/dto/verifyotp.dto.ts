import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly otp: string;
}
