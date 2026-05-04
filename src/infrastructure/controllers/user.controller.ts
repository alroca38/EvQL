import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { RegisterUserRequestDto } from "../../application/dtos/register-user.request.dto";

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() registerDto: RegisterUserRequestDto) {
        return await this.registerUserUseCase.execute(registerDto)
    }
}