import React, { FC, useContext, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import get from 'lodash.get';
import { useFormContext } from 'react-hook-form';
import {
  FieldProps,
  SelectFieldOptionsFromContextSchema,
  SelectFieldStyles,
} from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';

export const SelectFieldContextOptions: FC<FieldProps<
  SelectFieldOptionsFromContextSchema
>> = ({ id, name, field }) => {
  const {
    label,
    helperText,
    isRequired,
    shouldDisplay,
    styles = {},
    optionsKey,
    placeholder,
    defaultValue,
  } = field;

  const { register, watch, ...restOfForm } = useFormContext();

  const reactContext = get(restOfForm, 'reactContext');

  const {
    // @ts-ignore
    [optionsKey]: optns = [],
  } = useContext(reactContext);

  const options = optns as Array<{ label: string; value: any }>;

  const values = watch(name);

  const fieldStyles = useStyles<SelectFieldStyles>('selectField', styles);

  const errorMessage = useErrorMessage(name, label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  return (
    <FormControl
      key={`${name}-control`}
      isRequired={isRequired}
      isInvalid={Boolean(errorMessage)}
      {...fieldStyles.control}
    >
      {Boolean(label) && (
        <FormLabel htmlFor={name} {...fieldStyles.label}>
          {label}
        </FormLabel>
      )}
      <Select
        data-testid={id}
        {...register(name)}
        defaultValue={defaultValue || null}
        {...(placeholder && { placeholder })}
        {...fieldStyles.select}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </Select>
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
