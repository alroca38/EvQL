import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

export interface SqlAnalysisInput {
  query: string;
  ddlScript: string;
  executionTimeMs?: number;
  status?: string;
}

export interface SqlAnalysisResult {
  explanation: string;
  recommendations: string[];
  suggestedIndexes: string[];
  rewrittenQuery?: string;
  rewriteExplanation?: string;
}

@Injectable()
export class SqlAssistantService {
  private readonly logger = new Logger(SqlAssistantService.name);
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyze(input: SqlAnalysisInput): Promise<SqlAnalysisResult> {
    const prompt = `
Eres un experto en bases de datos y optimización SQL. Analiza la siguiente consulta SQL y genera recomendaciones de mejora.

Esquema de la base de datos:
${input.ddlScript}

Consulta enviada por el estudiante:
${input.query}

${input.executionTimeMs ? `Tiempo de ejecución: ${input.executionTimeMs}ms` : ''}
${input.status ? `Estado de evaluación: ${input.status}` : ''}

Devuelve SOLO un JSON con esta estructura exacta, sin markdown ni texto adicional:
{
  "explanation": "Explicación general de la consulta y sus problemas",
  "recommendations": ["recomendación 1", "recomendación 2"],
  "suggestedIndexes": ["CREATE INDEX ...", "CREATE INDEX ..."],
  "rewrittenQuery": "SELECT ... (versión optimizada, o null si no aplica)",
  "rewriteExplanation": "Explicación de por qué la reescritura es mejor, o null si no aplica"
}
`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      });

      let response = completion.choices[0].message.content ?? '{}';
      response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      return JSON.parse(response) as SqlAnalysisResult;
    } catch (error) {
      this.logger.error('Error analyzing SQL query', error);
      return {
        explanation: 'No se pudo generar análisis automático.',
        recommendations: [],
        suggestedIndexes: [],
      };
    }
  }
}