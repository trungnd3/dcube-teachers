import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { Student } from './student.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const testStudentEmail = 'test_student@mail.com';

const oneStudent = { id: 1, email: testStudentEmail } as Student;

const studentsArray = [
  oneStudent,
  { id: 2, email: 'test2@mail.com' } as Student,
  { id: 3, email: 'test3@mail.com' } as Student,
];

const createdId = 4;
let createdStudent: Student;

describe('StudentsService', () => {
  let service: StudentsService;
  let fakeRepo: Partial<Repository<Student>>;

  beforeEach(async () => {
    fakeRepo = {
      find: jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(studentsArray || null);
        });
      }),
      findOne: jest
        .fn()
        .mockImplementation(
          ({ where }: FindOneOptions<Student>): Promise<Student | null> => {
            let email: string;
            if (Array.isArray(where)) {
              // Handle case when `where` is an array (e.g., return the first condition's email)
              email = where[0]?.email as string;
            } else {
              email = where.email as string;
            }
            return new Promise((resolve) => {
              const student = studentsArray.find((s) => s.email === email);
              resolve(student || null);
            });
          },
        ),
      create: jest.fn().mockImplementation(({ email }) => {
        createdStudent = { id: createdId, email };
        return createdStudent;
      }),
      save: jest.fn().mockImplementation(() => Promise.resolve(createdStudent)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: fakeRepo,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find student by email that exists', async () => {
    const student = await service.findByEmail(oneStudent.email);
    expect(student).not.toBeNull();
    expect(student.id).toEqual(oneStudent.id);
  });

  it('should not find student by email that does not exist', async () => {
    const student = await service.findByEmail('rubbish@email');
    expect(student).toBeNull();
  });

  it('should create by email if not exist', async () => {
    const student = await service.create('created_student@mail.com');
    expect(student).not.toBeNull();
    expect(student.id).toEqual(createdStudent.id);
  });
});
