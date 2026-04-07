// Schemas
import { loginSchema, registerSchema } from '@app/schemas/auth';

// Types
import type { ZodError, z } from 'zod';
import type { LoginFormValues, RegisterFormValues } from '@app/schemas/auth';
import type { LoginPayload, RegisterPayload } from '@app/interfaces/auth';

export type ValidationResult<T> =
  | { ok: true; payload: T }
  | { ok: false; errors: Partial<Record<string, string>> };

function collectZodFieldErrors(
  zodError: ZodError,
): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};

  for (const issue of zodError.issues) {
    const fieldName = issue.path[0] as string | undefined;
    if (fieldName && !errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  }

  return errors;
}

function validateWithSchema<TValues, TPayload>(
  schema: z.ZodType<TValues>,
  values: unknown,
  transform: (data: TValues) => TPayload,
): ValidationResult<TPayload> {
  const result = schema.safeParse(values);

  if (result.success) {
    return {
      ok: true,
      payload: transform(result.data),
    };
  } else {
    return {
      ok: false,
      errors: collectZodFieldErrors(result.error),
    };
  }
}

export function validateLogin(
  values: LoginFormValues,
): ValidationResult<LoginPayload> {
  return validateWithSchema(loginSchema, values, data => ({
    identifier: data.identifier,
    password: data.password,
  }));
}

export function validateRegister(
  values: RegisterFormValues,
): ValidationResult<RegisterPayload> {
  return validateWithSchema(registerSchema, values, data => ({
    username: data.username,
    email: data.email,
    password: data.password,
  }));
}
