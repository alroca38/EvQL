import { User } from '../../domain/entities/user.entity';

export class UserResponseDto {
  id!: string | undefined;
  code!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  username!: string;
  role!: string;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.code = user.code;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.email = user.email;
    dto.username = user.username;
    dto.role = user.role;
    return dto;
  }
}