import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../domain/entities/role.enum';
import { SubmitSolutionUseCase } from '../../application/use-cases/submissions/submit-solution.use-case';
import { GetMySubmissionsUseCase } from '../../application/use-cases/submissions/get-my-submissions.use-case';
import { CreateSubmissionRequestDto } from '../../application/dtos/create-submission.request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('submissions')
export class SubmissionController {
  constructor(
    private readonly submitUseCase: SubmitSolutionUseCase,
    private readonly getMyUseCase: GetMySubmissionsUseCase,
  ) {}

  @Post()
  @Roles(Role.STUDENT, Role.PROFESSOR)
  async submit(@Request() req: any, @Body() dto: CreateSubmissionRequestDto) {
    const studentId: string = req.user.userId;
    const submission = await this.submitUseCase.execute(studentId, dto);

    return {
      message: 'Submission received and queued for evaluation.',
      submissionId: submission.id,
      status: submission.status,
    };
  }

  @Get('me')
  @Roles(Role.STUDENT)
  async getMySubmissions(@Request() req: any) {
    const studentId: string = req.user.userId;
    return this.getMyUseCase.execute(studentId);
  }
}