import { IsEmail, IsEnum, IsString, minLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/entities/role.enum';

export class RegisterUserRequestDto {
  @ApiProperty({ example: '200157981' })
  @MinLength(9, { message: 'El código debe tener al menos 9 caracteres' })
  code!: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(2)
  firstName!: string;

  @ApiProperty({ example: 'Salazar' })
  @IsString()
  @MinLength(2)
  lastName!: string;

  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  email!: string;

  @ApiProperty({ example: 'juan123' })
  @IsString()
  @MinLength(4, { message: 'El nombre de usuario debe tener al menos 4 caracteres' })
  username!: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @ApiProperty({ enum: Role, example: Role.STUDENT })
  @IsEnum(Role, { message: 'El rol proporcionado no es válido' })
  role!: Role;
}