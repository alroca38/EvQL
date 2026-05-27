import { Challenge } from './challenge.entity';
import { Course } from './course.entity';

export class Evaluation {
  constructor(
    public id: string | undefined,
    public name: string,
    public description: string,
    public startDate: Date,
    public endDate: Date,
    public duration: number,
    public maxAttempts: number,
    public score: number,
    public courseId: string,
    public course: Course | null,
    public challenges: Challenge[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
