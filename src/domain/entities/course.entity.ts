import { Challenge } from "./challenge.entity";
import { User } from "./user.entity";

export class Course{
    constructor(
        public id: string,
        public name: string,
        public code: string,
        public period: string,
        public teacher: User,
        public students: User[],
        public challenges: Challenge[],
        //evaluations
    ){}
}