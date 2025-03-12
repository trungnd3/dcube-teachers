import { DataSource } from 'typeorm';
import { Teacher } from './teacher.entity';
import { literals } from 'src/constants';

export const teacherProviders = [
  {
    provide: literals.TEACHER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Teacher),
    inject: [literals.DATA_SOURCE],
  },
];
