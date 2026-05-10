import { User } from "../../domain/entities/user.entity";
import { UserModel } from '@prisma/client';

export class PostgresUserMapper {
    static toDomain(model: UserModel) : User {
        return new User(
            model.id,
            model.code,
            model.firstName,
            model.lastName,
            model.email,
            model.username,
            model.passwordHash,
            model.role as any
        )
    }

    static toPersistence(entity: User) : UserModel {
        return {
            id: entity.id!,
            code: entity.code,
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            username: entity.username,
            passwordHash: entity.password,
            role: entity.role as any,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}