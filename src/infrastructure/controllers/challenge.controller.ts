import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';

import { CreateChallengeUseCase } from '../../application/use-cases/challenges/create-challenge.use-case';
import { GetChallengesUseCase } from '../../application/use-cases/challenges/get-challenges.use-case';
import { GetChallengeUseCase } from '../../application/use-cases/challenges/get-challenge.use-case';
import { UpdateChallengeUseCase } from '../../application/use-cases/challenges/update-challenge.use-case';
import { DeleteChallengeUseCase } from '../../application/use-cases/challenges/delete-challenge.use-case';
import { GetChallengesByCourseUseCase } from '../../application/use-cases/challenges/get-challenges-by-course.use-case';
import { UpdateChallengeStatusUseCase } from '../../application/use-cases/challenges/update-challenge-status.use-case';
import { GetMyAvailableChallengesUseCase } from '../../application/use-cases/challenges/get-my-available-challenges.use-case';
import { GetChallengesByEvaluationUseCase } from '../../application/use-cases/challenges/get-challenges-by-evaluation.use-case';
import { CreateChallengeDto } from '../../application/dtos/create-challenge.dto';
import { UpdateChallengeDto } from '../../application/dtos/update-challenge.dto';
import { ChallengeStatus } from '../../domain/entities/challenge-status.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../domain/entities/role.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Challenges')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('challenges')
export class ChallengeController {
  constructor(
    private createUseCase: CreateChallengeUseCase,
    private getAllUseCase: GetChallengesUseCase,
    private getOneUseCase: GetChallengeUseCase,
    private updateUseCase: UpdateChallengeUseCase,
    private deleteUseCase: DeleteChallengeUseCase,
    private getByCourseUseCase: GetChallengesByCourseUseCase,
    private updateStatusUseCase: UpdateChallengeStatusUseCase,
    private getMyAvailableChallengesUseCase: GetMyAvailableChallengesUseCase,
    private getChallengesByEvaluationUseCase: GetChallengesByEvaluationUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new challenge' })
  @Roles(Role.ADMIN, Role.PROFESSOR)
  async create(@Body() body: CreateChallengeDto) {
    return this.createUseCase.execute(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all challenges' })
  @Roles(Role.ADMIN, Role.PROFESSOR)
  async findAll() {
    return this.getAllUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a challenge by ID' })
  async findOne(@Param('id') id: string) {
    return this.getOneUseCase.execute(id);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Find challenges by course ID' })
  async findByCourse(@Param('courseId') courseId: string) {
    return this.getByCourseUseCase.execute(courseId);
  }

  @Get('me')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get available challenges for the current student' })
  async findMyAvailableChallenges(@Req() req: any) {
    return this.getMyAvailableChallengesUseCase.execute(req.user.userId);
  }

  @Get('evaluation/:id')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @ApiOperation({ summary: 'Find challenges by evaluation ID' })
  async findByEvaluation(@Param('id') id: string) {
    return this.getChallengesByEvaluationUseCase.execute(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Update a challenge' })
  async update(@Param('id') id: string, @Body() body: UpdateChallengeDto) {
    return this.updateUseCase.execute(id, body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of a challenge' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ChallengeStatus,
  ) {
    return this.updateStatusUseCase.execute(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a challenge' })
  @Roles(Role.ADMIN, Role.PROFESSOR)
  async remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }
}
