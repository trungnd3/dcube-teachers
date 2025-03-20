import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { Teacher } from 'src/teachers/teacher.entity';
import { Student } from 'src/students/student.entity';
import { TeachersService } from 'src/teachers/teachers.service';
import { generateStudentData, generateTeacherData } from 'src/mocks/data.mock';

describe('ApiService', () => {
  let apiService: ApiService;
  let teachersService: TeachersService;
  let teacher1: Teacher, teacher2: Teacher;
  let studentsArray: Student[];

  let apiModule: TestingModule;
  const mockTeachersService = {
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    registerStudents: jest.fn(),
    findCommonStudents: jest.fn(),
    suspendStudent: jest.fn(),
    getForNotification: jest.fn(),
  };

  async function getModule() {
    return Test.createTestingModule({
      providers: [
        ApiService,
        { provide: TeachersService, useValue: mockTeachersService },
      ],
    }).compile();
  }

  beforeEach(async () => {
    ({ studentsArray } = generateStudentData());
    ({ teacher1, teacher2 } = generateTeacherData(studentsArray));

    apiModule = await getModule();
    teachersService = apiModule.get<TeachersService>(TeachersService);
    apiService = apiModule.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(apiService).toBeDefined();
  });

  it('should call findAll by teachersService when getAllTeacher', async () => {
    await apiService.getAllTeacher();
    expect(teachersService.findAll).toHaveBeenCalled();
  });

  it('should call create by teachersService when createTeacher', async () => {
    await apiService.createTeacher('non_exist@mail.com');
    expect(teachersService.create).toHaveBeenCalledWith('non_exist@mail.com');
  });

  it('should call registerStudents by teachersService when register', async () => {
    await apiService.register(teacher1.email, [
      studentsArray[0].email,
      studentsArray[1].email,
    ]);
    expect(teachersService.registerStudents).toHaveBeenCalledWith(
      teacher1.email,
      [studentsArray[0].email, studentsArray[1].email],
    );
  });

  it('should call findCommonStudents by teachersService when getCommonStudents with string', async () => {
    await apiService.getCommonStudents(teacher1.email);
    expect(teachersService.findCommonStudents).toHaveBeenCalledWith([
      teacher1.email,
    ]);
  });

  it('should call findCommonStudents by teachersService when getCommonStudents', async () => {
    await apiService.getCommonStudents([teacher1.email, teacher2.email]);
    expect(teachersService.findCommonStudents).toHaveBeenCalledWith([
      teacher1.email,
      teacher2.email,
    ]);
  });

  it('should call suspendStudent by teachersService when suspendStudent', async () => {
    await apiService.suspendStudent(teacher1.email, teacher1.students[0].email);
    expect(teachersService.suspendStudent).toHaveBeenCalledWith(
      teacher1.email,
      teacher1.students[0].email,
    );
  });

  it('should call getForNotification by teachersService when getForNotification', async () => {
    await apiService.getForNotification({
      teacher: teacher1.email,
      notification: 'notification',
    });
    expect(teachersService.getForNotification).toHaveBeenCalledWith(
      teacher1.email,
      'notification',
    );
  });
});
