import { Injectable } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';

@Injectable()
export class ApiService {
  constructor(private teachersService: TeachersService) {}

  getAllTeacher() {
    return this.teachersService.findAll();
  }

  createTeacher(email: string) {
    return this.teachersService.create(email);
  }

  register(teacherEmail: string, studentEmails: string[]) {
    return this.teachersService.registerStudents(teacherEmail, studentEmails);
  }
}
