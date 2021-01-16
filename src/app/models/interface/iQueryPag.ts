export interface IQueryPag {
  ordenBy?: any;
  page?: number;
  limit?: number;
  query?: { titulo?: string; edad?: string; marca?: string[]; tamano?: string }; // {titulo: ''}
  select?: any;
}
