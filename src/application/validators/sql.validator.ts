import { BadRequestException } from '@nestjs/common';

export class SqlValidator {
  private static readonly FORBIDDEN_DDL = /\b(DROP\s+DATABASE|TRUNCATE\s+DATABASE)\b/i;
  private static readonly FORBIDDEN_DML = /\b(DELETE\s+FROM|TRUNCATE)\b/i;
  private static readonly DDL_REQUIRED = /\bCREATE\s+TABLE\b/i;
  private static readonly SEED_REQUIRED = /\bINSERT\s+INTO\b/i;

  static validateDdl(script: string): void {
    if (!this.DDL_REQUIRED.test(script)) {
      throw new BadRequestException(
        'DDL script must contain at least one CREATE TABLE statement.'
      );
    }
    if (this.FORBIDDEN_DDL.test(script)) {
      throw new BadRequestException(
        'DDL script contains forbidden statements (DROP DATABASE, TRUNCATE DATABASE).'
      );
    }
  }

  static validateSeed(script: string): void {
    if (!this.SEED_REQUIRED.test(script)) {
      throw new BadRequestException(
        'Seed script must contain at least one INSERT INTO statement.',
      );
    }
    if (this.FORBIDDEN_DML.test(script)) {
      throw new BadRequestException(
        'Seed script contains forbidden statements (DELETE FROM, TRUNCATE).',
      );
    }
  }
}