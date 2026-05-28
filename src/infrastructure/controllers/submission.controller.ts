import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../domain/entities/role.enum';
import { SubmitSolutionUseCase } from '../../application/use-cases/submissions/submit-solution.use-case';
import { GetMySubmissionsUseCase } from '../../application/use-cases/submissions/get-my-submissions.use-case';
import { GetEvaluationChallengeSubmissionsUseCase } from '../../application/use-cases/submissions/get-evaluation-challenge-submissions.use-case';
import { GetChallengeSubmissionsUseCase } from '../../application/use-cases/challenges/get-challenge-submissions.use-case';
import { CreateSubmissionRequestDto } from '../../application/dtos/create-submission.request.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('submissions')
export class SubmissionController {
  constructor(
    private readonly submitUseCase: SubmitSolutionUseCase,
    private readonly getMyUseCase: GetMySubmissionsUseCase,
    private readonly getEvaluationChallengeSubmissions: GetEvaluationChallengeSubmissionsUseCase,
    private readonly getChallengeSubmissionsUseCase: GetChallengeSubmissionsUseCase,
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
  @ApiOperation({ summary: 'Get all submissions for the current student' })
  async getMySubmissions(@Request() req: any) {
    const studentId: string = req.user.userId;
    return this.getMyUseCase.execute(studentId);
  }

  @Get('evaluation/:evaluationId/challenge/:challengeId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get submissions for a specific challenge in an evaluation' })
  @ApiParam({ name: 'evaluationId', type: String })
  @ApiParam({ name: 'challengeId', type: String })
  async getEvaluationChallengeSubmissionsRoute(
    @Request() req: any,
    @Param('evaluationId') evaluationId: string,
    @Param('challengeId') challengeId: string,
  ) {
    const studentId: string = req.user.userId;
    return this.getEvaluationChallengeSubmissions.execute(studentId, evaluationId, challengeId);
  }

  @Get('evaluation/:evaluationId/challenge/:challengeId/all')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get all student submissions for a challenge in an evaluation (professor view)' })
  @ApiParam({ name: 'evaluationId', type: String })
  @ApiParam({ name: 'challengeId', type: String })
  async getAllChallengeSubmissions(
    @Param('evaluationId') evaluationId: string,
    @Param('challengeId') challengeId: string,
  ) {
    return this.getChallengeSubmissionsUseCase.execute(evaluationId, challengeId);
  }
}