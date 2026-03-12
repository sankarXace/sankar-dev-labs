import { HttpStatus } from '@nestjs/common';
import { HttpError } from './http-error';

export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found') {
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
  }
}
