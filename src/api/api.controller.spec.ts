import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { Teacher } from 'src/teachers/teacher.entity';

describe('ApiController', () => {
  let controller: ApiController;
  // let apiService: ApiService;
  let fakeApiService: Partial<ApiService>;

  beforeEach(async () => {
    const teachers: Teacher[] = [];

    fakeApiService = {
      getAllTeacher: () => Promise.resolve<Teacher[]>([] as Teacher[]),
      createTeacher: (email: string) => {
        const t = {
          id: Math.floor(Math.random() * 99999),
          email,
        } as Teacher;
        teachers.push(t);
        return Promise.resolve(t);
      },
      register: (teacherEmail: string, studentEmails: string[]) => {
        const t = teachers.find((t) => t.email === teacherEmail) as Teacher;
        for (const sm of studentEmails) {
          const s = { id: Math.floor(Math.random() * 99999), email: sm };
          t.students.push(s);
        }
        return Promise.resolve(t);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: ApiService,
          useValue: fakeApiService,
        },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
