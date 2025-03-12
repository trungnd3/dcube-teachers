import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { literals } from 'src/constants';

const testStudentEmail = 'test_student@mail.com';

const oneStudent = { id: 1, email: testStudentEmail } as Student;

const studentsArray = [
  oneStudent,
  { id: 2, email: 'test2@mail.com' } as Student,
  { id: 3, email: 'test3@mail.com' } as Student,
];

describe('StudentsService', () => {
  let service: StudentsService;
  let fakeRepo: Partial<Repository<Student>>;

  beforeEach(async () => {
    fakeRepo = {
      find: jest.fn().mockResolvedValue(studentsArray),
      findOne: jest.fn().mockResolvedValue(oneStudent),
      create: jest.fn().mockResolvedValue(oneStudent),
      save: jest
        .fn()
        .mockImplementation((student: Student) => Promise.resolve(student)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: literals.STUDENT_REPOSITORY,
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

  // it('should not find student by email that does not exist', async () => {
  //   const student = await service.findByEmail('rubbish@email');
  //   expect(student).toBeNull();
  // });

  it('should create by email if not exist', async () => {
    const student = await service.create(oneStudent.email);
    expect(student).not.toBeNull();
    expect(student.id).toEqual(oneStudent.id);
  });
});
