import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { type IUserRepository } from '../../domain/repositories/user.repository';
import { RegisterUserRequestDto } from '../dtos/register-user.request.dto';
import { UserResponseDto } from '../dtos/user.response.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: RegisterUserRequestDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByCode(request.code);
    if (existingUser) {
      throw new ConflictException('User with this code already exists');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);
    const user = new User(
      undefined,
      request.code,
      request.firstName,
      request.lastName,
      request.email,
      request.username,
      hashedPassword,
      request.role,
    );

    const savedUser = await this.userRepository.save(user);

    return UserResponseDto.fromEntity(savedUser);
  }
}