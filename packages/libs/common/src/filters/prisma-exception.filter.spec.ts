import { ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaExceptionFilter } from './prisma-exception.filter';

const mockResponse = () => {
  const res: { status: jest.Mock; json: jest.Mock } = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
  let host: ArgumentsHost;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
    response = mockResponse();
    host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost;
  });

  it('maps P2025 to 404 Not Found', () => {
    const exception = new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '1.0',
    });
    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, code: 'P2025' })
    );
  });

  it('maps P2002 to 409 Conflict', () => {
    const exception = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '1.0',
    });
    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(409);
  });
});
