import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import {
  CreateTeacherDto,
  RegisterDto,
  SuspendStudentDto,
  GetForNotificationDto,
} from './dtos';

describe('ApiController', () => {
  let controller: ApiController;
  let apiService: ApiService;

  // Mock ApiService
  const mockApiService = {
    getAllTeacher: jest.fn(),
    createTeacher: jest.fn(),
    register: jest.fn(),
    getCommonStudents: jest.fn(),
    suspendStudent: jest.fn(),
    getForNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [{ provide: ApiService, useValue: mockApiService }],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    apiService = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /teachers', () => {
    it('should call getAllTeacher and return result', async () => {
      const mockTeachers = [{ id: 1, email: 'teacher@example.com' }];
      mockApiService.getAllTeacher.mockResolvedValue(mockTeachers);

      const result = await controller.getAllTeachers();

      expect(apiService.getAllTeacher).toHaveBeenCalled();
      expect(result).toEqual(mockTeachers);
    });
  });

  describe('POST /teachers', () => {
    it('should call createTeacher and return result', async () => {
      const dto: CreateTeacherDto = { email: 'teacher@example.com' };
      const mockResponse = { id: 1, email: 'teacher@example.com' };
      mockApiService.createTeacher.mockResolvedValue(mockResponse);

      const result = await controller.creatTeacher(dto);

      expect(apiService.createTeacher).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('POST /register', () => {
    it('should call register and return no content', async () => {
      const dto: RegisterDto = {
        teacher: 'teacher@example.com',
        students: ['student@example.com'],
      };
      mockApiService.register.mockResolvedValue(undefined);

      const result = await controller.register(dto);

      expect(apiService.register).toHaveBeenCalledWith(
        dto.teacher,
        dto.students,
      );
      expect(result).toBeUndefined(); // HTTP 204 NO CONTENT
    });
  });

  describe('GET /commonstudents', () => {
    it('should call getCommonStudents and return result', async () => {
      const teachers = ['teacher1@example.com', 'teacher2@example.com'];
      const mockStudents = {
        students: ['student1@example.com', 'student2@example.com'],
      };
      mockApiService.getCommonStudents.mockResolvedValue(mockStudents);

      const result = await controller.getCommonStudents(teachers);

      expect(apiService.getCommonStudents).toHaveBeenCalledWith(teachers);
      expect(result).toEqual(mockStudents);
    });
  });

  describe('POST /suspend', () => {
    it('should call suspendStudent and return no content', async () => {
      const dto: SuspendStudentDto = {
        teacher: 'teacher@example.com',
        student: 'student@example.com',
      };
      mockApiService.suspendStudent.mockResolvedValue(undefined);

      const result = await controller.suspendStudent(dto);

      expect(apiService.suspendStudent).toHaveBeenCalledWith(
        dto.teacher,
        dto.student,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('POST /retrievefornotifications', () => {
    it('should call getForNotification and return result', async () => {
      const dto: GetForNotificationDto = {
        teacher: 'teacher@example.com',
        notification: 'Hello students!',
      };
      const mockResponse = {
        recipients: ['student1@example.com', 'student2@example.com'],
      };
      mockApiService.getForNotification.mockResolvedValue(mockResponse);

      const result = await controller.getForNotification(dto);

      expect(apiService.getForNotification).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });
});
