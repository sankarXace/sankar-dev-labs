import * as Joi from 'joi';
import { validationSchema } from './validation.schema';

const schema = Joi.object(validationSchema);

describe('validationSchema', () => {
  it('rejects when DATABASE_URL is missing', () => {
    const env = {};
    const { error } = schema.validate(env, { presence: 'required' });
    expect(error).toBeDefined();
    expect(error?.details.some((d) => /DATABASE_URL|required/i.test(d.message))).toBe(true);
  });

  it('rejects when DATABASE_URL is not a valid URI', () => {
    const env = { DATABASE_URL: 'not-a-uri' };
    const { error } = schema.validate(env);
    expect(error).toBeDefined();
  });

  it('accepts valid DATABASE_URL', () => {
    const env = { DATABASE_URL: 'postgresql://user:pass@localhost:5432/db' };
    const { error, value } = schema.validate(env, { allowUnknown: true });
    expect(error).toBeUndefined();
    expect(value.DATABASE_URL).toBe(env.DATABASE_URL);
  });
});
