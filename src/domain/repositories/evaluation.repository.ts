import { Evaluation } from '../entities/evaluation.entity';

export interface IEvaluationRepository {
  save(evaluation: Evaluation): Promise<Evaluation>;
  findAll(): Promise<Evaluation[]>;
  findById(id: string): Promise<Evaluation | null>;
  update(evaluation: Evaluation): Promise<Evaluation>;
  delete(id: string): Promise<void>;
  addChallenge(evaluationId: string, challengeId: string): Promise<void>;
  removeChallenge(evaluationId: string, challengeId: string): Promise<void>;
  findAvailableForStudent(studentId: string): Promise<Evaluation[]>;
}
