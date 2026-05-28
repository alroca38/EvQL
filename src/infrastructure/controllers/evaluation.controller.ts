import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, ParseUUIDPipe, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../domain/entities/role.enum';
import { CreateEvaluationUseCase } from '../../application/use-cases/evaluations/create-evaluation.use-case';
import { GetAllEvaluationsUseCase } from '../../application/use-cases/evaluations/get-all-evaluations.use-case';
import { GetEvaluationByIdUseCase } from '../../application/use-cases/evaluations/get-evaluation-by-id.use-case';
import { UpdateEvaluationUseCase } from '../../application/use-cases/evaluations/update-evaluation.use-case';
import { DeleteEvaluationUseCase } from '../../application/use-cases/evaluations/delete-evaluation.use-case';
import {
  AddChallengeToEvaluationUseCase,
  RemoveChallengeFromEvaluationUseCase,
} from '../../application/use-cases/evaluations/manage-evaluation-challenges.use-case';
import { GetMyEvaluationsUseCase } from '../../application/use-cases/evaluations/get-my-evaluations.use-case';
import { CreateEvaluationRequestDto } from '../../application/dtos/create-evaluation.request.dto';
import { UpdateEvaluationRequestDto } from '../../application/dtos/update-evaluation.request.dto';

@ApiTags('Evaluations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('evaluations')
export class EvaluationController {
  constructor(
    private readonly createEvaluation: CreateEvaluationUseCase,
    private readonly getAllEvaluations: GetAllEvaluationsUseCase,
    private readonly getEvaluationById: GetEvaluationByIdUseCase,
    private readonly updateEvaluation: UpdateEvaluationUseCase,
    private readonly deleteEvaluation: DeleteEvaluationUseCase,
    private readonly addChallenge: AddChallengeToEvaluationUseCase,
    private readonly removeChallenge: RemoveChallengeFromEvaluationUseCase,
    private readonly getMyEvaluations: GetMyEvaluationsUseCase,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new evaluation' })
  async create(@Body() dto: CreateEvaluationRequestDto) {
    return this.createEvaluation.execute(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @ApiOperation({ summary: 'List all evaluations' })
  async findAll() {
    return this.getAllEvaluations.execute();
  }

  @Get('me')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get all evaluations available for the current student' })
  async findMyEvaluations(@Req() req: any) {
    return this.getMyEvaluations.execute(req.user.userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @ApiOperation({ summary: 'Get an evaluation by ID' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getEvaluationById.execute(id);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @ApiOperation({ summary: 'Update an evaluation' })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEvaluationRequestDto,
  ) {
    return this.updateEvaluation.execute(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an evaluation (admin only)' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteEvaluation.execute(id);
  }

  @Post(':id/challenges/:challengeId')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @ApiOperation({ summary: 'Add a challenge to an evaluation' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'challengeId', type: String })
  async addChallengeToEvaluation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('challengeId') challengeId: string,
  ) {
    return this.addChallenge.execute(id, challengeId);
  }

  @Delete(':id/challenges/:challengeId')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a challenge from an evaluation' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'challengeId', type: String })
  async removeChallengeFromEvaluation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('challengeId') challengeId: string,
  ) {
    return this.removeChallenge.execute(id, challengeId);
  }
}
