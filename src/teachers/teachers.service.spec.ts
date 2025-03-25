import { Test, TestingModule } from '@nestjs/testing';
import { TeachersService } from './teachers.service';
import { Teacher } from './teacher.entity';
import { StudentsService } from '@src//students/students.service';
import { Student } from '@src/students/student.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepositoryFactory } from '@src/mocks/repository.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { generateStudentData, generateTeacherData } from '@src/mocks/data.mock';

describe('TeachersService', () => {
  let teachersService: TeachersService;
  let teacher1: Teacher, teacher2: Teacher, teacher3: Teacher;
  let teachersArray: Teacher[];
  let createdTeacher: Teacher;

  let studentsArray: Student[];
  let createdStudent: Student;

  let mockTeachersRepo: ReturnType<typeof mockRepositoryFactory<Teacher>>;
  let mockStudentsRepo: ReturnType<typeof mockRepositoryFactory<Student>>;
  let teachersModule: TestingModule;

  async function getModule() {
    return Test.createTestingModule({
      providers: [
        TeachersService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockTeachersRepo,
        },
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentsRepo,
        },
      ],
    }).compile();
  }

  beforeEach(async () => {
    ({ studentsArray, createdStudent } = generateStudentData());
    ({ teacher1, teacher2, teacher3, teachersArray, createdTeacher } =
      generateTeacherData(studentsArray));

    mockTeachersRepo = mockRepositoryFactory<Teacher>(
      teachersArray,
      createdTeacher.id,
      createdTeacher,
    );
    mockStudentsRepo = mockRepositoryFactory<Student>(
      studentsArray,
      createdStudent.id,
      createdStudent,
    );

    teachersModule = await getModule();
    teachersService = teachersModule.get<TeachersService>(TeachersService);
  });

  it('should be defined', () => {
    expect(teachersService).toBeDefined();
  });

  it('should find all teachers', async () => {
    const teachers = await teachersService.findAll();
    expect(teachers).not.toBeNull();
    expect(teachers.length).toEqual(teachersArray.length);
  });

  it('should find teacher by email that exists', async () => {
    const teacher = await teachersService.findByEmail(teacher1.email);
    expect(teacher).not.toBeNull();
    expect(teacher.id).toEqual(teacher1.id);
  });

  it('should not find teacher by email that does not exist', async () => {
    const teacher = await teachersService.findByEmail('rubbish@email');
    expect(teacher).toBeNull();
  });

  it('should create by email if not exist', async () => {
    const teacher = await teachersService.create('created_teacher@mail.com');
    expect(teacher).not.toBeNull();
    expect(teacher.id).toEqual(createdTeacher.id);
  });

  it('should not create by email if exist', async () => {
    expect(teachersService.create(teacher1.email)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not register students if teacher not found', async () => {
    expect(
      teachersService.registerStudents('rubbish@email', []),
    ).rejects.toThrow(NotFoundException);
  });

  it('should generate student array if not exist when register students', async () => {
    delete teacher1.students;
    const teacher = await teachersService.registerStudents(teacher1.email, [
      'not_exist_student@mail.com',
    ]);

    const student = studentsArray.find(
      (s) => s.email === 'not_exist_student@mail.com',
    );
    expect(student).toBeDefined();

    const registeredStudent = teacher.students.find(
      (r) => r.email === 'not_exist_student@mail.com',
    );

    expect(registeredStudent).toBeDefined();
  });

  it('should create student if student not exist when register students', async () => {
    const teacher = await teachersService.registerStudents(teacher1.email, [
      'not_exist_student@mail.com',
    ]);

    const student = studentsArray.find(
      (s) => s.email === 'not_exist_student@mail.com',
    );
    expect(student).toBeDefined();

    const registeredStudent = teacher.students.find(
      (r) => r.email === 'not_exist_student@mail.com',
    );

    expect(registeredStudent).toBeDefined();
  });

  it('should find common students id', async () => {
    const teachersToFind = [
      {
        id: 2,
        email: 'teacher2@mail.com',
        students: [studentsArray[0], studentsArray[2]],
      } as Teacher,
      {
        id: 3,
        email: 'teacher3@mail.com',
        students: [studentsArray[1], studentsArray[2]],
      } as Teacher,
    ];
    mockTeachersRepo
      .createQueryBuilder()
      .getRawMany.mockResolvedValue([
        ...teacher2.students,
        ...teacher3.students,
      ]);

    teachersModule = await getModule();
    teachersService = teachersModule.get<TeachersService>(TeachersService);

    const teacherEmails = teachersToFind.map((t) => t.email);
    const result = await teachersService.findCommonStudents(teacherEmails);

    expect(mockTeachersRepo.createQueryBuilder).toHaveBeenCalledWith('teacher');
    expect(mockTeachersRepo.createQueryBuilder().where).toHaveBeenCalledWith(
      'teacher.email IN (:...emails)',
      { emails: teacherEmails },
    );
    expect(result).toEqual([studentsArray[2].email]);
  });

  it('should throw error if no teacher found when suspend student', async () => {
    expect(
      teachersService.suspendStudent('rubbish@mail.com', 'not_exist@mail.com'),
    ).rejects.toThrow('Teacher does not exist.');
  });

  it('should throw error if no student found when suspend student', async () => {
    expect(
      teachersService.suspendStudent('teacher1@mail.com', 'not_exist@mail.com'),
    ).rejects.toThrow('Student does not exist.');
  });

  it('should not suspend student if student is not registered to teacher', async () => {
    const studentNumber = teacher1.students.length;
    const teacher = await teachersService.suspendStudent(
      teacher1.email,
      teacher2.students[0].email,
    );

    expect(teacher.students.length).toBe(studentNumber);
  });

  it('should suspend student if student is registered to teacher', async () => {
    const studentNumber = teacher1.students.length;
    const teacher = await teachersService.suspendStudent(
      teacher1.email,
      teacher1.students[0].email,
    );

    expect(teacher.students.length).toBe(studentNumber - 1);
  });

  it('should throw error if no teacher found when get notfication', async () => {
    expect(
      teachersService.getForNotification('rubbish@mail.com', 'notification'),
    ).rejects.toThrow('Teacher does not exist.');
  });

  it('should get recipients who are students registered to teacher even without mentioned', async () => {
    const recipients = await teachersService.getForNotification(
      teacher1.email,
      'notification',
    );

    expect(recipients.length).toBe(teacher1.students.length);
    expect(recipients[0]).toBe(teacher1.students[0].email);
  });

  it('should suspend student if student is registered to teacher', async () => {
    const recipients = await teachersService.getForNotification(
      teacher1.email,
      `notification @${teacher2.students[0].email}`,
    );

    expect(recipients.length).toBe(teacher1.students.length + 1);
    expect(recipients[1]).toBe(teacher2.students[0].email);
  });
});
