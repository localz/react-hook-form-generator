import React, { FC, useContext, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormErrorMessage,
  Textarea,
  FormHelperText,
  Divider,
} from '@chakra-ui/react';

import { FieldProps, FieldStyles, TextAreaFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';
import LabelElement from './elements/Label';

export const TextAreaField: FC<FieldProps<TextAreaFieldSchema>> = ({
  name,
  field,
  defaultValue,
  index,
}) => {
  const {
    label,
    labelAddon,
    placeholder,
    helperText,
    tooltip,
    isRequired,
    shouldDisplay,
    styles = {},
    divideAfter,
    disabled,
    readOnly,
  } = field;

  const fieldStyles = useStyles<FieldStyles>('textAreaField', styles);

  const { isReadOnly } = useContext(Ctx);

  const { register, control } = useFormContext();

  const errorMessage = useErrorMessage(name, label);

  const values = useWatch({
    control,
  });

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <FormControl
        isRequired={isRequired}
        isInvalid={Boolean(errorMessage)}
        {...fieldStyles.control}
        isReadOnly={isReadOnly}
      >
        <LabelElement
          label={label}
          labelAddon={labelAddon}
          name={name}
          fieldStyles={fieldStyles}
          tooltip={tooltip}
        />
        <Textarea
          placeholder={placeholder}
          {...register(name)}
          defaultValue={defaultValue || ''}
          isDisabled={disabled}
          isReadOnly={isReadOnly || readOnly}
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
