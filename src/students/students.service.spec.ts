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
      // as these do not actually use their return values in our sample
      // we just make sure that their resolve is true to not crash
      remove: jest
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
});
