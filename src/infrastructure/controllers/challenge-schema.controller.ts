import { Body, Controller, Get, Param, Put, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../domain/entities/role.enum';
import { UploadChallengeSchemaUseCase } from '../../application/use-cases/upload-challenge-schema.use-case';
import { GetChallengeSchemaUseCase } from '../../application/use-cases/get-challenge-schema.use-case';
import { UploadSchemaRequestDto } from '../../application/dtos/upload-schema.request.dto';

@ApiTags('Challenge Schemas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('challenges/:challengeId/schema')
export class ChallengeSchemaController {
    constructor(
        private readonly uploadSchemaUseCase: UploadChallengeSchemaUseCase,
        private readonly getSchemaUseCase: GetChallengeSchemaUseCase,
    ) {}

    @Put()
    @Roles(Role.PROFESSOR, Role.ADMIN)
    @ApiOperation({ summary: 'Upload or replace the SQL schema for a challenge' })
    @ApiParam({ name: 'challengeId', type: String })
    async upload(@Param('challengeId', ParseUUIDPipe) challengeId: string, @Body() dto: UploadSchemaRequestDto) {
        return this.uploadSchemaUseCase.execute(challengeId, dto);
    }

    @Get()
    @Roles(Role.PROFESSOR, Role.ADMIN, Role.STUDENT)
    @ApiOperation({ summary: 'Get the SQL schema for a challenge' })
    @ApiParam({ name: 'challengeId', type: String })
    async get(@Param('challengeId', ParseUUIDPipe) challengeId: string) {
        return this.getSchemaUseCase.execute(challengeId);
    }
}