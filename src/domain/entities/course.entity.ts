import { Challenge } from './challenge.entity';
import { User } from './user.entity';

export class Course {
  constructor(
    public id: string | undefined,
    public name: string,
    public code: string,
    public period: string,
    public group: string,
    public professorId: string,
    public professor: User | null,
    public students: User[],
    public challenges: Challenge[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}