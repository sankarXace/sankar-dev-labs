import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { validationSchema } from './validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object(validationSchema),
      validationOptions: { allowUnknown: true },
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
