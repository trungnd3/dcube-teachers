import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';

@Controller('api')
export class ApiController {
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    const { teacher, students } = registerDto;
    console.log(teacher, students);
    return 'success';
  }
}
