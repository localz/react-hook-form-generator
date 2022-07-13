import React, { FC, useContext, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Select,
  Divider,
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
import { Ctx } from './Form';

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
    divideAfter,
  } = field;

  const { isReadOnly } = useContext(Ctx);

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
    <>
      <FormControl
        key={`${name}-control`}
        isRequired={isRequired}
        isInvalid={Boolean(errorMessage)}
        {...fieldStyles.control}
        isReadOnly={isReadOnly}
      >
        {Boolean(label) && (
          <FormLabel htmlFor={name} {...fieldStyles.label}>
            {label}
          </FormLabel>
        )}
        <Select
          disabled={isReadOnly}
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
      {divideAfter && <Divider mt="8" />}
    </>
  );
};
