import { Injectable } from '@nestjs/common';
import { TableSeedConfigDto, FieldConfigDto } from '../dtos/generate-seed.request.dto';

@Injectable()
export class DataGeneratorService {
  generate(tables: TableSeedConfigDto[]): string {
    const generatedIds: Record<string, number[]> = {};
    const scripts: string[] = [];

    for (const tableConfig of tables) {
      const rows: string[] = [];

      for (let i = 1; i <= tableConfig.rows; i++) {
        generatedIds[tableConfig.table] ??= [];
        generatedIds[tableConfig.table].push(i);

        const values = Object.entries(tableConfig.fields).map(([_, fieldConfig]) =>
          this.generateValue(fieldConfig, generatedIds)
        );

        rows.push(`(${values.join(', ')})`);
      }

      const columns = Object.keys(tableConfig.fields).join(', ');
      scripts.push(
        `INSERT INTO ${tableConfig.table} (${columns}) VALUES\n${rows.join(',\n')};`
      );
    }

    return scripts.join('\n\n');
  }

  private generateValue(field: FieldConfigDto, generatedIds: Record<string, number[]>): string {
    if (field.nullable && Math.random() < field.nullable) return 'NULL';

    switch (field.type) {
      case 'integer':
        return String(this.randomInt(field.min ?? 1, field.max ?? 1000));

      case 'decimal':
        return this.randomDecimal(field.min ?? 0, field.max ?? 1000).toFixed(2);

      case 'date':
        return `'${this.randomDate(field.from ?? '2020-01-01', field.to ?? '2026-12-31')}'`;

      case 'enum':
        return `'${this.randomPick(field.values ?? [])}'`;

      case 'string':
        return `'${this.randomString()}'`;

      case 'foreign_key': {
        if (!field.references) return 'NULL';
        const refTable = field.references.split('.')[0];
        const ids = generatedIds[refTable];
        if (!ids || ids.length === 0) return 'NULL';
        return String(this.randomPick(ids));
      }

      default:
        return 'NULL';
    }
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomDecimal(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private randomDate(from: string, to: string): string {
    const start = new Date(from).getTime();
    const end = new Date(to).getTime();
    const date = new Date(start + Math.random() * (end - start));
    return date.toISOString().split('T')[0];
  }

  private randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomString(): string {
    return `user_${Math.random().toString(36).substring(2, 8)}`;
  }
}