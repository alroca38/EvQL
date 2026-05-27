import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from '../controllers/user.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { GetUsersByRoleUseCase } from '../../application/use-cases/users/get-users-by-role.use-case';
import { PrismaService } from '../persistence/prisma.service';
import { PrismaUserRepository } from '../persistence/repositories/prisma-user.repository';
import { AuthController } from '../controllers/auth.controller';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RegisterUserUseCase,
    GetUsersByRoleUseCase,
    LoginUseCase,
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
