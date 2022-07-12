import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightAddon,
  FormHelperText,
  FormErrorMessage,
  Divider,
  Spacer,
  Box,
} from '@chakra-ui/react';

import { FieldProps, FieldStyles, TextFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import LabelElement from './elements/Label';

export const TextField: FC<FieldProps<TextFieldSchema>> = ({
  id,
  name,
  field,
}) => {
  const {
    label,
    placeholder,
    htmlInputType,
    helperText,
    isRequired,
    leftInputAddon,
    rightInputAddon,
    shouldDisplay,
    styles = {},
    defaultValue,
    tooltip,
    divideAfter,
  } = field;

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

  const { register, watch } = useFormContext();

  const errorMessage = useErrorMessage(name, label);

  const values = watch(name);

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
        isInvalid={Boolean(errorMessage)}
        {...fieldStyles.control}
      >
        <LabelElement
          label={label}
          name={name}
          fieldStyles={fieldStyles}
          tooltip={tooltip}
        />
        {leftInputAddon || rightInputAddon ? (
          <InputGroup {...fieldStyles.inputGroup}>
            {Boolean(leftInputAddon) && <InputLeftAddon {...leftInputAddon} />}
            <Input
              data-testid={id}
              type={htmlInputType || 'text'}
              aria-label={name}
              {...register(name)}
              placeholder={placeholder}
              defaultValue={defaultValue || ''}
              {...fieldStyles.input}
            />
            {rightInputAddon && <InputRightAddon {...rightInputAddon} />}
          </InputGroup>
        ) : (
          <Input
            data-testid={id}
            type={htmlInputType || 'text'}
            aria-label={name}
            {...register(name)}
            placeholder={placeholder}
            defaultValue={defaultValue || ''}
            {...fieldStyles.input}
          />
        )}
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
