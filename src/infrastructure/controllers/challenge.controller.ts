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

@Controller('challenges')
export class ChallengeController {
  constructor(
    private createUC: CreateChallengeUseCase,
    private getAllUC: GetChallengesUseCase,
    private getOneUC: GetChallengeUseCase,
    private updateUC: UpdateChallengeUseCase,
    private deleteUC: DeleteChallengeUseCase,
  ) {}

  @Post()
  create(@Body() body) {
    return this.createUC.execute(body);
  }

  @Get()
  findAll() {
    return this.getAllUC.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getOneUC.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.updateUC.execute(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUC.execute(id);
  }
}
