import { User } from "../entities/user.entity";
import { Role } from "../entities/role.enum";

export interface IUserRepository {
    save(user: User): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByCode(code: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByRole(role: Role): Promise<User[]>;
}