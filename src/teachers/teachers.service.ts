import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { literals } from 'src/constants';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class TeachersService {
  constructor(
    @Inject(literals.TEACHER_REPOSITORY)
    private repo: Repository<Teacher>,

    private studentsService: StudentsService,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async create(email: string) {
    // Check teacher duplication in DB
    const teacher = await this.findByEmail(email);
    if (teacher) {
      throw new BadRequestException('Teacher with this email already exists');
    }

    // Create teacher
    const toCreate = this.repo.create({ email });
    return this.repo.save(toCreate);
  }

  async registerStudents(teacherEmail: string, studentEmails: string[]) {
    // Get teacher from DB
    const teacher = await this.repo.findOne({ where: { email: teacherEmail } });

    // Check if teacher exists
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Iterate each student email
    for (const studentEmail of studentEmails) {
      // Get student from DB
      let student = await this.studentsService.findByEmail(studentEmail);

      // Check if student exists
      // If not, create new one
      if (!student) {
        student = await this.studentsService.create(studentEmail);
      }

      // Add student to teacher's student list
      if (!teacher.students || teacher.students.length === 0) {
        teacher.students = [];
      }

      teacher.students.push(student);
    }

    // Save teacher to DB
    return this.repo.save(teacher);
  }
}
