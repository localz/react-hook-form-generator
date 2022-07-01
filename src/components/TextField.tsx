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
  } = field;

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

  const { register, watch } = useFormContext();

  const errorMessage = useErrorMessage(name, label);

  const values = watch(name);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return <p>hidden</p>;
  }

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!!errorMessage}
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
  );
};
