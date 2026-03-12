import { HttpStatus, HttpException } from '@nestjs/common';

export class HttpError extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly code?: string
  ) {
    super({ message, code }, statusCode);
  }
}
