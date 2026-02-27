export interface SearchLog {
  id: string;
  userId?: string | null;
  query: string;
  results: number;
  createdAt: Date;
}
