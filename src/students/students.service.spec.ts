import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { mockRepositoryFactory } from 'src/mocks/repository.mock';
import { Student } from './student.entity';

const testStudentEmail = 'test_student@mail.com';

const oneStudent = { id: 1, email: testStudentEmail } as Student;

const studentsArray = [
  oneStudent,
  { id: 2, email: 'test2@mail.com' } as Student,
  { id: 3, email: 'test3@mail.com' } as Student,
];

const createdId = 4;
const createdStudent: Student = {
  id: createdId,
  email: 'created_student@mail.com',
};

describe('StudentsService', () => {
  let studentsService: StudentsService;
  const fakeRepo = mockRepositoryFactory<Student>(
    studentsArray,
    createdId,
    createdStudent,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: fakeRepo,
        },
      ],
    }).compile();

    studentsService = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(studentsService).toBeDefined();
  });

  it('should find student by email that exists', async () => {
    const student = await studentsService.findByEmail(oneStudent.email);
    expect(student).not.toBeNull();
    expect(student.id).toEqual(oneStudent.id);
  });

  it('should not find student by email that does not exist', async () => {
    const student = await studentsService.findByEmail('rubbish@email');
    expect(student).toBeNull();
  });

  it('should create by email if not exist', async () => {
    const student = await studentsService.create('created_student@mail.com');
    expect(student).not.toBeNull();
    expect(student.id).toEqual(createdStudent.id);
  });

  it('should not create by email if exist', async () => {
    const student = await studentsService.create(oneStudent.email);
    expect(student).toBeNull();
  });
});
