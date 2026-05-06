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
  create(@Body() body: CreateChallengeDto) {
    return this.createUseCase.execute(body);
  }

  @Get()
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
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }
}
