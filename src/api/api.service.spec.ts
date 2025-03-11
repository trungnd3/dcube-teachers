import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { Teacher } from 'src/teachers/teacher.entity';
import { Repository } from 'typeorm';
import { literals } from 'src/constants';
import { Student } from 'src/students/student.entity';
import { TeachersService } from 'src/teachers/teachers.service';
import { StudentsService } from 'src/students/students.service';

const testStudentEmail = 'test_student@mail.com';

const oneStudent = { id: 1, email: testStudentEmail } as Student;

const studentsArray = [
  oneStudent,
  { id: 2, email: 'test2@mail.com' } as Student,
  { id: 3, email: 'test3@mail.com' } as Student,
];

const testTeacherEmail = 'test_teacher@mail.com';

const oneTeacher = { id: 1, email: testTeacherEmail } as Teacher;

const teachersArray = [
  oneTeacher,
  { id: 2, email: 'test2@mail.com' } as Teacher,
  { id: 3, email: 'test3@mail.com' } as Teacher,
];

describe('ApiService', () => {
  let service: ApiService;
  let fakeTeachersRepo: Partial<Repository<Teacher>>;
  let fakeStudentsRepo: Partial<Repository<Student>>;

  beforeEach(async () => {
    fakeStudentsRepo = {
      find: jest.fn().mockResolvedValue(studentsArray),
      findOne: jest.fn().mockResolvedValue(oneStudent),
      create: jest.fn().mockResolvedValue(oneStudent),
      save: jest
        .fn()
        .mockImplementation((student: Student) => Promise.resolve(student)),
    };
    fakeTeachersRepo = {
      find: jest.fn().mockResolvedValue(teachersArray),
      findOne: jest.fn().mockResolvedValue(oneTeacher),
      create: jest.fn().mockResolvedValue(oneTeacher),
      save: jest
        .fn()
        .mockImplementation((teacher: Teacher) => Promise.resolve(teacher)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        TeachersService,
        {
          provide: literals.TEACHER_REPOSITORY,
          useValue: fakeTeachersRepo,
        },
        StudentsService,
        {
          provide: literals.STUDENT_REPOSITORY,
          useValue: fakeStudentsRepo,
        },
      ],
    }).compile();

    service = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
