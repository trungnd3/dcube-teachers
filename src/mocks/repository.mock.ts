import { FindOneOptions } from 'typeorm';

// mocks/repository.mock.ts
export function mockRepositoryFactory<T extends { id: number; email: string }>(
  list: T[],
  createdId: number,
  created: T,
) {
  // let created = {}
  return {
    find: jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(list || null);
      });
    }),
    findOne: jest
      .fn()
      .mockImplementation(({ where }: FindOneOptions<T>): Promise<T | null> => {
        let email: string;
        if (Array.isArray(where)) {
          // Handle case when `where` is an array (e.g., return the first condition's email)
          email = where[0]?.email as string;
        } else {
          email = where.email as string;
        }
        return new Promise((resolve) => {
          const result = list.find((s) => s.email === email);
          resolve(result || null);
        });
      }),
    create: jest.fn().mockImplementation(({ email }) => {
      const existing = list.find((s) => s.email === email);
      if (existing) {
        return null;
      }

      created.id = createdId;
      created.email = email;
      list.push(created);
      return created;
    }),
    save: jest.fn().mockImplementation((entity: T) => Promise.resolve(entity)),
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };
}
