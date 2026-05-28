import { PartialType } from '@nestjs/swagger';
import { CreateEvaluationRequestDto } from './create-evaluation.request.dto';

export class UpdateEvaluationRequestDto extends PartialType(CreateEvaluationRequestDto) {}
