import { User } from "../entities/user.entity";

export interface UserRepository {
    save(user: User): Promise<void>;
    findByUsername(username: string): Promise<User | null>;
    findByCode(code: string): Promise<User | null>;
}