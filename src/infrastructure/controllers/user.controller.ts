import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { RegisterUserRequestDto } from "../../application/dtos/register-user.request.dto";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../../domain/entities/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags('Users')
//@ApiBearerAuth()  // Temporalmente comentado para testing
//@UseGuards(AuthGuard('jwt'), RolesGuard)  // Temporalmente comentado para testing
@Controller('users')
export class UserController {
    constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

    @Post('register')
    //@Roles(Role.ADMIN)  // Temporalmente comentado para testing
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() registerDto: RegisterUserRequestDto) {
        return await this.registerUserUseCase.execute(registerDto)
    }
}