import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { CreateChallengeUseCase } from '../../application/use-cases/challenges/create-challenge.use-case';
import { GetChallengesUseCase } from '../../application/use-cases/challenges/get-challenges.use-case';
import { GetChallengeUseCase } from '../../application/use-cases/challenges/get-challenge.use-case';
import { UpdateChallengeUseCase } from '../../application/use-cases/challenges/update-challenge.use-case';
import { DeleteChallengeUseCase } from '../../application/use-cases/challenges/delete-challenge.use-case';
import { GetChallengesByCourseUseCase } from '../../application/use-cases/challenges/get-challenges-by-course.use-case';
import { UpdateChallengeStatusUseCase } from '../../application/use-cases/challenges/update-challenge-status.use-case';
import { CreateChallengeDto } from '../../application/dtos/create-challenge.dto';
import { UpdateChallengeDto } from '../../application/dtos/update-challenge.dto';
import { ChallengeStatus } from '../../domain/entities/challenge-status.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../domain/entities/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  create(@Body() body: CreateChallengeDto) {
    return this.createUseCase.execute(body);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  findAll() {
    return this.getAllUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getOneUseCase.execute(id);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.getByCourseUseCase.execute(courseId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  update(@Param('id') id: string, @Body() body: UpdateChallengeDto) {
    return this.updateUseCase.execute(id, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ChallengeStatus,
  ) {
    return this.updateStatusUseCase.execute(id, status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }
}
