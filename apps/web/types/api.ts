export interface pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  success: boolean;
  timestamp: string;
  meta: pagination;
  data: T[];
}
