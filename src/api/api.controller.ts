import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { ApiService } from './api.service';
import { CreateTeacherDto } from './dtos/create-teacher.dto';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Get('/teachers')
  getAllTeachers() {
    return this.apiService.getAllTeacher();
  }

  @Post('/teachers')
  creatTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    const { email } = createTeacherDto;
    return this.apiService.createTeacher(email);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    const { teacher, students } = registerDto;
    return this.apiService.register(teacher, students);
  }
}
