import { Student } from 'src/students/student.entity';
import { Teacher } from 'src/teachers/teacher.entity';

export function generateStudentData() {
  const student1 = { id: 1, email: 'student1@mail.com' } as Student;
  const student2 = { id: 2, email: 'student2@mail.com' } as Student;
  const student3 = { id: 3, email: 'student3@mail.com' } as Student;
  const studentsArray = [student1, student2, student3];

  const createdStudentId = 4;
  const createdStudent: Student = {
    id: createdStudentId,
    email: 'created_student@mail.com',
  };

  return {
    student1,
    studentsArray,
    createdStudent,
  };
}

export function generateTeacherData(students: Student[]) {
  const teacher1 = {
    id: 1,
    email: 'teacher1@mail.com',
    students: [students[2]],
  } as Teacher;
  const teacher2 = {
    id: 2,
    email: 'teacher2@mail.com',
    students: [students[0], students[2]],
  } as Teacher;
  const teacher3 = {
    id: 3,
    email: 'teacher3@mail.com',
    students: [students[1], students[2]],
  } as Teacher;
  const teachersArray = [teacher1, teacher2, teacher3];

  const createdTeacherId = 4;
  const createdTeacher: Teacher = {
    id: createdTeacherId,
    email: 'created_teacher@mail.com',
    students: [],
  };

  return {
    teacher1,
    teacher2,
    teacher3,
    teachersArray,
    createdTeacher,
  };
}
