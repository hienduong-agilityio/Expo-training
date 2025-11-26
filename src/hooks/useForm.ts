import { useCallback, useState } from 'react';

// Types
type FieldErrors = Partial<Record<string, string>>;

interface IUseFormOptions {
  initialValues: Record<string, string>;
}

export const useForm = ({ initialValues }: IUseFormOptions) => {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = useCallback((field: string, value: string) => {
    setValues((prev: Record<string, string>) => ({ ...prev, [field]: value }));

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

  const setFieldError = useCallback((field: string, error: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  return {
    values,
    fieldErrors,
    handleChange,
    resetForm,
    setFieldError,
  };
};
