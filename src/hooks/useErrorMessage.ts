import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const useErrorMessage = (name: string, label?: string) => {
  const { formState } = useFormContext();
  const errors: Record<
    string,
    {
      message: string;
    }
  > = formState.errors;

  return useMemo(() => {
    const error = errors[name];

    if (!error) {
      return undefined;
    }

    const message = error.message;

    if (message) {
      return message.replace(name, label || name);
    }

    return 'Field validation failed';
  }, [errors, name, label]);
};
