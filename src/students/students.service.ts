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

  create(email: string) {
    const student = this.repo.create({ email });
    return this.repo.save(student);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
