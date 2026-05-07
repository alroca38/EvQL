import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginRequestDto } from '../../application/dtos/login.request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginRequestDto) {
    return await this.loginUseCase.execute(loginDto);
  }
}
