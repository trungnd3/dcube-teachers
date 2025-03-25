import { dbClient } from '../db';

const createTeacherDto = {
  email: 'teacher1@mail.com',
};

const registerDto = {
  teacher: 'teacher1@mail.com',
  students: ['student1@mail.com', 'student2@mail.com'],
};

const BASE_URI = process.env.API_BASE_URI;

describe('API', () => {
  beforeAll(async () => {
    await dbClient.query('DELETE FROM teacher_students_student;');
    await dbClient.query('DELETE FROM student;');
    await dbClient.query('DELETE FROM teacher;');
  });

  afterAll(async () => {
    await dbClient.close();
  });

  it('should get all teachers', async () => {
    const response = await fetch(`${BASE_URI}/teachers`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.length).toBe(0);
  });

  it('should create a teacher', async () => {
    const response = await fetch(`${BASE_URI}/teachers`, {
      method: 'POST',
      body: JSON.stringify(createTeacherDto),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.email).toBe(createTeacherDto.email);
  });

  it('should register students to a teacher', async () => {
    const response = await fetch(`${BASE_URI}/register`, {
      method: 'POST',
      body: JSON.stringify(registerDto),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(204);
  });

  it('should return not found if register students to a non-existing teacher', async () => {
    const response = await fetch(`${BASE_URI}/register`, {
      method: 'POST',
      body: JSON.stringify({
        ...registerDto,
        teacher: 'non-exist-teacher@mail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(404);
  });

  it('should get all students of a teacher', async () => {
    const getCommonUrl = new URL(`${BASE_URI}/commonstudents`);
    const params = new URLSearchParams();

    params.append('teacher', createTeacherDto.email);

    getCommonUrl.search = params.toString();
    const response = await fetch(getCommonUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.length).toBe(registerDto.students.length);
    expect(data[0]).toBe(registerDto.students[0]);
  });

  it('should get common students of teachers', async () => {
    const secondTeacherMail = 'teacher2@mail.com';
    // Create second teacher
    await fetch(`${BASE_URI}/teachers`, {
      method: 'POST',
      body: JSON.stringify({ email: secondTeacherMail }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Register students to the second teacher
    await fetch(`${BASE_URI}/register`, {
      method: 'POST',
      body: JSON.stringify({
        teacher: secondTeacherMail,
        students: ['student1@mail.com', 'student3@mail.com'],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const getCommonUrl = new URL(`${BASE_URI}/commonstudents`);
    const params = new URLSearchParams();

    params.append('teacher', createTeacherDto.email);
    params.append('teacher', secondTeacherMail);

    getCommonUrl.search = params.toString();
    const response = await fetch(getCommonUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.length).toBe(1);
    expect(data[0]).toBe('student1@mail.com');
  });

  it('should return not found if suspend a student from being registered to a non-existing teacher', async () => {
    const response = await fetch(`${BASE_URI}/suspend`, {
      method: 'POST',
      body: JSON.stringify({
        teacher: 'non-exist-teacher@mail.com',
        student: 'student1@mail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(404);
  });

  it('should return not found if suspend a non-existing student from being registered to an existing teacher', async () => {
    const response = await fetch(`${BASE_URI}/suspend`, {
      method: 'POST',
      body: JSON.stringify({
        teacher: createTeacherDto.email,
        student: 'non-exist-student@gmail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(404);
  });

  it('should suspend an existing student from being registered to an existing teacher', async () => {
    const response = await fetch(`${BASE_URI}/suspend`, {
      method: 'POST',
      body: JSON.stringify({
        teacher: createTeacherDto.email,
        student: 'student1@mail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(204);
  });

  it('should return not found if get notification for a non-existing teacher', async () => {
    const response = await fetch(`${BASE_URI}/retrievefornotifications`, {
      method: 'POST',
      body: JSON.stringify({
        teacher: 'non-exist-teacher@mail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(400);
  });

  it('should get all students of an existing teacher when get notification without mention', async () => {
    const teachersRes = await fetch(`${BASE_URI}/teachers`);
    const teachers = await teachersRes.json();
    const teacher = teachers.find(
      (t: { id: number; email: string }) => t.email === createTeacherDto.email,
    );

    const response = await fetch(`${BASE_URI}/retrievefornotifications`, {
      method: 'POST',
      body: JSON.stringify({
        teacher: createTeacherDto.email,
        notification: 'Hello students!',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);
    const recipients = await response.json();
    expect(teacher.students.length).toBe(recipients.length);
  });

  it('should get all students of an existing teacher when get notification with mention', async () => {
    const teachersRes = await fetch(`${BASE_URI}/teachers`);
    const teachers = await teachersRes.json();
    const teacher = teachers.find(
      (t: { id: number; email: string }) => t.email === createTeacherDto.email,
    );

    const response = await fetch(`${BASE_URI}/retrievefornotifications`, {
      method: 'POST',
      body: JSON.stringify({
        teacher: createTeacherDto.email,
        notification:
          'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);
    const recipients = await response.json();
    expect(teacher.students.length).toBe(recipients.length - 2);
  });
});
