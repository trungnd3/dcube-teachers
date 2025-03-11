import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetForNotificationDto {
  @IsNotEmpty()
  @IsEmail()
  teacher: string;

  @IsString()
  notification: string;
}
