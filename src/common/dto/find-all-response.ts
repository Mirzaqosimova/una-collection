export interface Result<T> {
  entities: T;
  total_count: number;
  hasNextPage: boolean;
}

export function getResult<T>(
  entities: T,
  totalCount: number,
  hasNextPage: boolean,
): Result<T> {
  return {
    entities,
    total_count: totalCount,
    hasNextPage,
  };
}
