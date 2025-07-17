import { User } from '../types/User';

export interface Position {
  id: number;
  description: string;
  level: string;
  division: string;
  
  users: User[];
}
