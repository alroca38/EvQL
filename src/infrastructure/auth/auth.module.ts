import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from '../controllers/user.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { PrismaService } from '../persistence/prisma.service';
import { PrismaUserRepository } from '../persistence/repositories/prisma-user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [
    AuthService,
    JwtStrategy,
    RegisterUserUseCase,
    PrismaService,
    {
      provide: 'IUserRepository', // token @Inject del UseCase
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}