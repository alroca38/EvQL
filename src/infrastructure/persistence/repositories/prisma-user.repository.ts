import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";
import { PrismaService } from "../prisma.service";
import { PostgresUserMapper } from "../../mappers/postgres-user.mapper";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(user: User): Promise<User> {
        const savedUser = await this.prisma.userModel.upsert({
            where: { code: user.code },
            update: {
                firstName: user.firstName,
                lastName: user.lastName,
                passwordHash: user.password,
                role: user.role as any,
            },
            create: {
                code: user.code,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                passwordHash: user.password || '',
                role: user.role as any,
            }
        });
        return PostgresUserMapper.toDomain(savedUser);
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.prisma.userModel.findUnique({
            where: { username },
        });
        return user ? PostgresUserMapper.toDomain(user) : null;
    }

    async findByCode(code: string): Promise<User | null> {
        if (!code) return null;
        const user = await this.prisma.userModel.findUnique({
            where: { code },
        });
        return user ? PostgresUserMapper.toDomain(user) : null;
    }
}