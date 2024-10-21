import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
