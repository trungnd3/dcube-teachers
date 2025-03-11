import { DataSource } from 'typeorm';
import { Student } from './student.entity';
import { literals } from 'src/constants';

export const studentProviders = [
  {
    provide: literals.STUDENT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Student),
    inject: [literals.DATA_SOURCE],
  },
];
