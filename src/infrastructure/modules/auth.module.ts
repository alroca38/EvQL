import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';

import { PrismaService } from '../persistence/prisma.service';
import { PrismaUserRepository } from '../persistence/repositories/prisma-user.repository';

import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],

  controllers: [UserController, AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,

    RegisterUserUseCase,
    LoginUseCase,

    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],

  exports: [PassportModule, JwtModule, AuthService, JwtStrategy],
})
export class AuthModule {}
