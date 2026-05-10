import { Body, Controller, Get, Param, Post, Put, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../domain/entities/role.enum';
import { UploadChallengeSchemaUseCase } from '../../application/use-cases/upload-challenge-schema.use-case';
import { GetChallengeSchemaUseCase } from '../../application/use-cases/get-challenge-schema.use-case';
import { GenerateSeedUseCase } from '../../application/use-cases/generate-seed.use-case';
import { UploadSchemaRequestDto } from '../../application/dtos/upload-schema.request.dto';
import { GenerateSeedRequestDto } from '../../application/dtos/generate-seed.request.dto';

@ApiTags('Challenge Schemas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('challenges/:challengeId/schema')
export class ChallengeSchemaController {
    constructor(
        private readonly uploadSchemaUseCase: UploadChallengeSchemaUseCase,
        private readonly getSchemaUseCase: GetChallengeSchemaUseCase,
        private readonly generateSeedUseCase: GenerateSeedUseCase,
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

    @Post('seed/generate')
    @Roles(Role.PROFESSOR, Role.ADMIN)
    @ApiOperation({ summary: 'Generate random seed data for a challenge' })
    @ApiParam({ name: 'challengeId', type: String })
    async generateSeed(
        @Param('challengeId', ParseUUIDPipe) challengeId: string,
        @Body() dto: GenerateSeedRequestDto,
    ) {
        return this.generateSeedUseCase.execute(challengeId, dto);
    }
}