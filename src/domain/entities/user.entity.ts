import { Role } from "./role.enum";

export class User {
    constructor(
        public id: string | undefined,
        public code: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public username: string,
        public password: string,
        public role: Role
    ){}
}