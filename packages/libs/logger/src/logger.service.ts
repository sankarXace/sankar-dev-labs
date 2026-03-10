import { Injectable } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class LoggerService {
  protected readonly logger: pino.Logger;

  constructor(options?: pino.LoggerOptions | pino.Logger) {
    if (options && typeof (options as pino.Logger).child === 'function') {
      this.logger = options as pino.Logger;
    } else {
      this.logger = pino({
        level: process.env['LOG_LEVEL'] ?? 'info',
        ...(options as pino.LoggerOptions),
      });
    }
  }

  log(message: string, ...args: unknown[]): void {
    this.logger.info({ msg: message, ...this.flattenArgs(args) });
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error({ msg: message, ...this.flattenArgs(args) });
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn({ msg: message, ...this.flattenArgs(args) });
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug({ msg: message, ...this.flattenArgs(args) });
  }

  child(bindings: pino.Bindings): LoggerService {
    return new LoggerService(this.logger.child(bindings));
  }

  private flattenArgs(args: unknown[]): Record<string, unknown> {
    if (args.length === 0) return {};
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
      return args[0] as Record<string, unknown>;
    }
    return { args };
  }
}
