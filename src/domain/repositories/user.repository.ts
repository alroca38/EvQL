import { User } from "../entities/user.entity";

export interface IUserRepository {
    save(user: User): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByCode(code: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}