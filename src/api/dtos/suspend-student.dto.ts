import { IsEmail } from 'class-validator';

export class SuspendStudentDto {
  @IsEmail()
  teacher: string;

  @IsEmail()
  student: string;
}
