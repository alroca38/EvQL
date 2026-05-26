import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { SUBMISSION_QUEUE } from '../../application/use-cases/submissions/submit-solution.use-case';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { SubmissionStatus } from '../../domain/entities/submission-status.enum';
import type { IChallengeSchemaRepository } from '../../domain/repositories/challenge-schema.repository';
import Docker from 'dockerode';
import { randomUUID } from 'crypto';
import { Client as PgClient } from 'pg';

export interface EvaluationJobPayload {
  submissionId: string;
  challengeId: string;
  engine: string;
  query: string;
}

@Processor(SUBMISSION_QUEUE)
export class SqlEvaluationWorker extends WorkerHost {
  private readonly logger = new Logger(SqlEvaluationWorker.name);

  constructor(
    @Inject('ISubmissionRepository')
    private readonly submissionRepo: ISubmissionRepository,
    @Inject('IChallengeSchemaRepository')
    private readonly challengeSchemaRepo: IChallengeSchemaRepository,
  ) {
    super();
  }

  async process(job: Job<EvaluationJobPayload>): Promise<void> {
    const { submissionId, challengeId, engine, query } = job.data;

    this.logger.log(
      `[Job ${job.id}] Processing submission ${submissionId} | challenge: ${challengeId} | engine: ${engine}`,
    );

    try {
      await this.submissionRepo.updateStatus(submissionId, SubmissionStatus.RUNNING);
      this.logger.log(`[Job ${job.id}] Submission ${submissionId} → RUNNING`);

     
      const dbConfig = {
        POSTGRES_USER: 'testuser',
        POSTGRES_PASSWORD: 'testpass',
        POSTGRES_DB: `db_${randomUUID().slice(0, 8)}`,
      };
      const docker = new Docker();
      const container = await docker.createContainer({
        Image: 'postgres:16',
        Env: [
          `POSTGRES_USER=${dbConfig.POSTGRES_USER}`,
          `POSTGRES_PASSWORD=${dbConfig.POSTGRES_PASSWORD}`,
          `POSTGRES_DB=${dbConfig.POSTGRES_DB}`,
        ],
        HostConfig: {
          AutoRemove: true,
          PortBindings: { '5432/tcp': [{ HostPort: '' }] }, 
          Memory: 512 * 1024 * 1024, 
          NanoCpus: 500_000_000, 
        },
      });
      await container.start();

      
      const inspect = await container.inspect();
      const hostPort = inspect.NetworkSettings.Ports['5432/tcp'][0].HostPort;

      this.logger.log(`[Job ${job.id}] Contenedor PostgreSQL iniciado en puerto ${hostPort}`);

    
      await this.sleep(3000);

      
      const challengeSchema = await this.challengeSchemaRepo.findByChallengeId(challengeId);
      if (!challengeSchema) {
        throw new Error(`No se encontró el esquema para el challenge ${challengeId}`);
      }
      const { ddlScript, seedScript } = challengeSchema;


      const pgClient = new PgClient({
        host: 'localhost',
        port: parseInt(hostPort, 10),
        user: dbConfig.POSTGRES_USER,
        password: dbConfig.POSTGRES_PASSWORD,
        database: dbConfig.POSTGRES_DB,
      });
      await pgClient.connect();
      this.logger.log(`[Job ${job.id}] Ejecutando DDL...`);
      await pgClient.query(ddlScript);
      this.logger.log(`[Job ${job.id}] Ejecutando seed...`);
      if (seedScript && seedScript.trim().length > 0) {
        await pgClient.query(seedScript);
      }
      this.logger.log(`[Job ${job.id}] Esquema y datos cargados correctamente`);

     
      let submissionResult = null;
      let executionTimeMs = 0;
      let submissionError: any = null;
      try {
        const start = Date.now();
        const result = await pgClient.query(query);
        executionTimeMs = Date.now() - start;
        submissionResult = result.rows;
        this.logger.log(`[Job ${job.id}] Consulta ejecutada en ${executionTimeMs}ms`);
      } catch (err) {
        submissionError = err;
        this.logger.error(`[Job ${job.id}] Error al ejecutar la consulta del estudiante:`, err);
      }
      await pgClient.end();

      
      let expectedResult: any = null;
      if ((challengeSchema as any).expectedResult) {
        try {
          expectedResult = JSON.parse((challengeSchema as any).expectedResult);
        } catch (e) {
          expectedResult = (challengeSchema as any).expectedResult;
        }
      }

      let status = SubmissionStatus.ACCEPTED;
      let score = 100;
      let feedback = '¡Correcto!';

      if (submissionError) {
        if (submissionError.message && submissionError.message.includes('syntax')) {
          status = SubmissionStatus.SYNTAX_ERROR;
          feedback = 'Error de sintaxis SQL.';
        } else {
          status = SubmissionStatus.RUNTIME_ERROR;
          feedback = 'Error de ejecución: ' + submissionError.message;
        }
        score = 0;
      } else if (expectedResult) {
        
        const stringify = (rows: any) => JSON.stringify(rows);
        if (stringify(submissionResult) !== stringify(expectedResult)) {
          status = SubmissionStatus.WRONG_ANSWER;
          feedback = 'El resultado no coincide con lo esperado.';
          score = 0;
        }
      }

      

      
      const recommendations: string[] = [];
      if (query.match(/select\s+\*/i)) {
        recommendations.push('Evita usar SELECT *; especifica solo las columnas necesarias.');
      }
      if (query.match(/where\s+.*=/i)) {
        recommendations.push('Considera crear un índice sobre las columnas usadas en WHERE para mejorar el rendimiento.');
      }
      if (query.match(/order by/i)) {
        recommendations.push('Si ORDER BY es frecuente, un índice sobre esa columna puede ayudar.');
      }
      if (query.match(/in\s*\(/i)) {
        recommendations.push('Evalúa si un JOIN puede ser más eficiente que una subconsulta IN.');
      }
      if (query.match(/group by/i)) {
        recommendations.push('Asegúrate de que las columnas en GROUP BY tengan sentido para el análisis.');
      }
      if (recommendations.length > 0) {
        feedback += '\n\nRecomendaciones de optimización SQL:';
        for (const rec of recommendations) {
          feedback += `\n- ${rec}`;
        }
      }


      
      if ((this.submissionRepo as any).updateResult.length >= 7) {
        
        await (this.submissionRepo as any).updateResult(
          submissionId,
          status,
          score,
          executionTimeMs,
          feedback,
          JSON.stringify(submissionResult),
          JSON.stringify(expectedResult),
        );
      } else {
       
        await (this.submissionRepo as any).updateResult(
          submissionId,
          status,
          score,
          executionTimeMs,
          feedback,
        );
      }
      this.logger.log(`[Job ${job.id}] Submission ${submissionId} → ${status} | time: ${executionTimeMs}ms`);

      await container.stop();
      this.logger.log(`[Job ${job.id}] Contenedor PostgreSQL eliminado`);
    } catch (error) {
      this.logger.error(
        `[Job ${job.id}] Failed to process submission ${submissionId}`,
        error,
      );
      await this.submissionRepo.updateStatus(submissionId, SubmissionStatus.RUNTIME_ERROR);
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  
}