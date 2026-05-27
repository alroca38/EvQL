import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository';
import { Role } from '../../../domain/entities/role.enum';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { USER_REPOSITORY } from '../../tokens';

@Injectable()
export class GetUsersByRoleUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(role: Role): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findByRole(role);
    return users.map(UserResponseDto.fromEntity);
  }
}
