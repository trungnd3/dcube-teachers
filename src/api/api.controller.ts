import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { ApiService } from './api.service';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { SuspendStudentDto } from './dtos/suspend-student.dto';
import { GetForNotificationDto } from './dtos/get-for-notification.dto';

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
  @HttpCode(HttpStatus.NO_CONTENT)
  register(@Body() registerDto: RegisterDto) {
    const { teacher, students } = registerDto;
    return this.apiService.register(teacher, students);
  }

  @Get('/commonstudents')
  getCommonStudents(@Query('teacher') teachers: string[]) {
    return this.apiService.getCommonStudents(teachers);
  }

  @Post('/suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  suspendStudent(@Body() suspendStudent: SuspendStudentDto) {
    // To suspend a user means to temporarily deactive or un-register user from a teacher
    // I will assume a teacher email is included in the body as well
    // In reality, teacher email might be from auth token.
    return this.apiService.suspendStudent(
      suspendStudent.teacher,
      suspendStudent.student,
    );
  }

  @Post('/retrievefornotifications')
  getForNotification(@Body() getForNotification: GetForNotificationDto) {
    return this.apiService.getForNotification(getForNotification);
  }
}
