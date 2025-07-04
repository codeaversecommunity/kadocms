export interface PaginatedResult<T> {
  success: boolean;
  timestamp: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  data: T[];
}
