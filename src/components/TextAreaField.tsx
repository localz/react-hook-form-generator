import React, { FC, useContext, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  FormHelperText,
  Divider,
} from '@chakra-ui/react';

import { FieldProps, FieldStyles, TextAreaFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

export const TextAreaField: FC<FieldProps<TextAreaFieldSchema>> = ({
  name,
  field,
  defaultValue,
}) => {
  const {
    label,
    placeholder,
    helperText,
    isRequired,
    shouldDisplay,
    styles = {},
    divideAfter,
  } = field;

  const fieldStyles = useStyles<FieldStyles>('textAreaField', styles);

  const { isReadOnly } = useContext(Ctx);

  const { register, control } = useFormContext();

  const errorMessage = useErrorMessage(name, label);

  const values = useWatch({
    control,
  });

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <FormControl
        isRequired={isRequired}
        isInvalid={!!errorMessage}
        {...fieldStyles.control}
        isReadOnly={isReadOnly}
      >
        {Boolean(label) && (
          <FormLabel htmlFor={name} {...fieldStyles.label}>
            {label}
          </FormLabel>
        )}
        <Textarea
          placeholder={placeholder}
          {...register(name)}
          defaultValue={defaultValue || ''}
          disabled={isReadOnly}
        />
        {Boolean(helperText) && (
          <FormHelperText {...fieldStyles.helperText}>
            {helperText}
          </FormHelperText>
        )}
        <FormErrorMessage {...fieldStyles.errorMessage}>
          {errorMessage}
        </FormErrorMessage>
      </FormControl>
      {divideAfter && <Divider mt="8" />}
    </>
  );
};
