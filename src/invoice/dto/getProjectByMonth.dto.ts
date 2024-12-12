import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class GetProjectsByYearAndMonthDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: 'Year must be a valid 4-digit number' })
  year: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Month must be a valid 2-digit number between 01 and 12' })
  month: string;
}
