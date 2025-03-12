import { Inject, Injectable } from '@nestjs/common';
import { literals } from 'src/constants';
import { Student } from './student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(literals.STUDENT_REPOSITORY)
    private repo: Repository<Student>,
  ) {}

  async create(email: string) {
    // Create student if only not exist
    let student = await this.findByEmail(email);
    if (!student) {
      student = this.repo.create({ email });
      return this.repo.save(student);
    }

    return null;
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
