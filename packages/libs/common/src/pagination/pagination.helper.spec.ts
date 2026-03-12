import { getSkipTake } from './pagination.helper';

describe('getSkipTake', () => {
  it('returns skip 0 and take equal to limit for first page', () => {
    const result = getSkipTake(1, 10);
    expect(result).toEqual({ skip: 0, take: 10 });
  });

  it('returns correct skip and take for page 2', () => {
    const result = getSkipTake(2, 10);
    expect(result).toEqual({ skip: 10, take: 10 });
  });

  it('returns correct skip and take for page 3 with limit 20', () => {
    const result = getSkipTake(3, 20);
    expect(result).toEqual({ skip: 40, take: 20 });
  });

  it('uses default limit when limit not provided', () => {
    const result = getSkipTake(1);
    expect(result).toEqual({ skip: 0, take: 20 });
  });
});
