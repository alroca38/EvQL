import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { RegisterUserRequestDto } from "../../application/dtos/register-user.request.dto";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../../domain/entities/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";

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