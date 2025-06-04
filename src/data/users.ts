import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    username: 'maya',
    password: '1234',
    role: 'admin'
  }
];

export const authenticate = (username: string, password: string): User | null => {
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};