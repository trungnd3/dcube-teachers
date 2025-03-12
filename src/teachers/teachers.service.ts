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
    return this.repo.findOne({
      where: { email },
      relations: { students: true },
    });
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
    const teacher = await this.findByEmail(teacherEmail);

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

  async findCommonStudents(teacherEmails: string[]) {
    // Get all students' id and email with the teacher email in the provided list
    const students = await this.repo
      .createQueryBuilder('teacher')
      .select('student.id, student.email')
      .leftJoin('teacher.students', 'student')
      .where('teacher.email IN (:...emails)', {
        emails: teacherEmails,
      })
      .getRawMany();

    // Create hash table that counts the number of students appearing in the list
    // If that number reach the teacher list number, we'll push it to the response list
    const studentEmails: string[] = []; // The response list
    const occurences = {}; // The hash table
    for (const student of students) {
      if (!occurences[student.id]) {
        occurences[student.id] = 0;
      }
      occurences[student.id]++;

      if (occurences[student.id] === teacherEmails.length) {
        studentEmails.push(student.email);
      }
    }

    return studentEmails;
  }

  async suspendStudent(teacherEmail: string, studentEmail: string) {
    const teacher = await this.findByEmail(teacherEmail);
    if (!teacher) {
      throw new NotFoundException('Teacher does not exist.');
    }

    const student = await this.studentsService.findByEmail(studentEmail);
    if (!student) {
      throw new NotFoundException('Student does not exist.');
    }

    const activeIndex = teacher.students.findIndex((s) => s.id === student.id);

    if (activeIndex < 0) {
      return teacher;
    }

    teacher.students.splice(activeIndex, 1);
    await this.repo.save(teacher);

    return teacher;
  }

  async getForNotification(teacherEmail: string, notification: string) {
    const teacher = await this.findByEmail(teacherEmail);
    if (!teacher) {
      throw new NotFoundException('Teacher does not exist.');
    }

    const recipients = teacher.students.map((s) => s.email);

    const pattern = /\B@[a-zA-Z0-9_@.]+/gi;
    const mentions = notification.match(pattern);

    if (!mentions) {
      return recipients;
    }

    for (const mention of mentions) {
      if (!recipients.includes(mention)) {
        recipients.push(mention);
      }
    }

    return recipients;
  }
}
