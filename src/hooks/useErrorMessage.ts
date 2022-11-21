import get from 'lodash.get';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const useErrorMessage = (name: string, label?: string) => {
  const { formState } = useFormContext();
  const errors = formState.errors as Record<
    string,
    {
      message: string;
    }
  >;

  return useMemo(() => {
    const error = get(errors, name);

    if (!error) {
      return undefined;
    }

    const message = error.message;

    if (message && typeof message === 'string') {
      return message.replace(name, label || name);
    }
    console.debug('Error message is not a string', message);

    return 'Field validation failed';
  }, [formState, errors, name, label]);
};
