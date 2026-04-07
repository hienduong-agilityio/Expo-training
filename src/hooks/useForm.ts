import { useCallback, useState } from 'react';

// Types
type FieldErrors<T extends string> = Partial<Record<T, string>>;

interface IUseFormOptions<T extends Record<string, string>> {
  initialValues: T;
}

interface IUseFormReturn<T extends Record<string, string>> {
  values: T;
  fieldErrors: Partial<Record<keyof T & string, string>>;
  handleChange: (field: keyof T & string, value: string) => void;
  resetForm: () => void;
  setFieldError: (field: keyof T & string, error: string) => void;
}

export const useForm = <T extends Record<string, string>>({
  initialValues,
}: IUseFormOptions<T>): IUseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<keyof T & string>>(
    {},
  );

  const handleChange = useCallback((field: keyof T & string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));

    setFieldErrors(prev => {
      if (prev[field]) {
        return { ...prev, [field]: '' };
      }
      return prev;
    });
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setFieldErrors({});
  }, [initialValues]);

  const setFieldError = useCallback(
    (field: keyof T & string, error: string) => {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    },
    [],
  );

  return {
    values,
    fieldErrors,
    handleChange,
    resetForm,
    setFieldError,
  };
};
