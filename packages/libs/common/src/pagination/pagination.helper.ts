/**
 * Converts page + limit to Prisma skip/take.
 */
export function getSkipTake(page: number = 1, limit: number = 20): { skip: number; take: number } {
  const pageNum = Math.max(1, page);
  const limitNum = Math.max(1, Math.min(limit, 100));
  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
}
