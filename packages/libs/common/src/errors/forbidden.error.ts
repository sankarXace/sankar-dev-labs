import { HttpStatus } from '@nestjs/common';
import { HttpError } from './http-error';

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}
