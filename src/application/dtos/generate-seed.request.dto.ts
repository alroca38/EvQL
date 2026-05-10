export class FieldConfigDto {
  type: string;
  min?: number;
  max?: number;
  from?: string;
  to?: string;
  values?: string[];
  references?: string;
  nullable?: number;
}

export class TableSeedConfigDto {
  table: string;
  rows: number;
  fields: Record<string, FieldConfigDto>;
}

export class GenerateSeedRequestDto {
  tables: TableSeedConfigDto[];
}