import { Injectable } from '@nestjs/common';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
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

  async findByEmail(email: string) {
    const student = await this.repo.findOne({ where: { email } });
    // console.log('findByEmail', student);
    return student;
  }
}
