import { Injectable } from '@nestjs/common';
import { isArray } from 'class-validator';
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

  getCommonStudents(teacherEmails: string[]) {
    if (!isArray(teacherEmails)) {
      teacherEmails = [teacherEmails];
    }
    return this.teachersService.findCommonStudents(teacherEmails);
  }

  suspendStudent(teacher: string, student: string) {
    return this.teachersService.suspendStudent(teacher, student);
  }

  getForNotification({ teacher, notification }) {
    return this.teachersService.getForNotification(teacher, notification);
  }
}
