
export interface ApiError {
  status: number;
  title: string;
  code?: string;
  fieldErrors?: ReadonlyArray<{ field: string; messages: string[] }>;
  raw: unknown;
}
