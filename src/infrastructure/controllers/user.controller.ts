import { Body, Controller, Post, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { RegisterUserRequestDto } from "../../application/dtos/register-user.request.dto";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../../domain/entities/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { GetUsersByRoleUseCase } from "../../application/use-cases/users/get-users-by-role.use-case";

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly getUsersByRole: GetUsersByRoleUseCase,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() registerDto: RegisterUserRequestDto) {
        return await this.registerUserUseCase.execute(registerDto)
    }

    @Get('students')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.PROFESSOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all students (admin and professor only)' })
    async getStudents() {
        return await this.getUsersByRole.execute(Role.STUDENT);
    }

    @Get('professors')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.PROFESSOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all professors (admin only)' })
    async getProfessors() {
        return await this.getUsersByRole.execute(Role.PROFESSOR);
    }
}