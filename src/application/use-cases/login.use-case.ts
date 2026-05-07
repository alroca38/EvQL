import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { type IUserRepository } from '../../domain/repositories/user.repository';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { LoginRequestDto } from '../dtos/login.request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    private readonly authService: AuthService,
  ) {}

  async execute(loginDto: LoginRequestDto) {
    const user = await this.userRepository.findByUsername(loginDto.username);
    console.log(user);
    console.log(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.generateToken(user);

    return {
      accessToken: token,
    };
  }
}
