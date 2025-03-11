import { IsArray, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  teacher: string;

  @IsArray()
  @IsEmail({}, { each: true })
  students: string[];
}
