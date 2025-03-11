import { literals } from 'src/constants';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: literals.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: +process.env.MYSQL_PORT || 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
