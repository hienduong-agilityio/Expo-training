import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@app/constants';

export const loginSchema = z.object({
  identifier: z.string().min(1, VALIDATION_MESSAGES.EMAIL_OR_USERNAME_REQUIRED),
  password: z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, VALIDATION_MESSAGES.USERNAME_MIN_LENGTH),
    email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
    password: z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
