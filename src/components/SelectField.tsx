import React, { FC, useContext, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Select,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { FieldProps, SelectFieldSchema, SelectFieldStyles } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

export const SelectField: FC<FieldProps<SelectFieldSchema>> = ({
  id,
  name,
  field,
  defaultValue,
}) => {
  const {
    label,
    helperText,
    isRequired,
    shouldDisplay,
    styles = {},
    divideAfter,
    placeholder,
  } = field;

  const { isReadOnly, selectOptions } = useContext(Ctx);

  const { register, watch } = useFormContext();

  const values = watch(name);

  const fieldStyles = useStyles<SelectFieldStyles>('selectField', styles);

  const errorMessage = useErrorMessage(name, label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  const isLoading = field.selectKey
    ? selectOptions[field.selectKey].isLoading
    : false;

  const options = field.selectKey
    ? selectOptions[field.selectKey].options
    : field.options;

  if (!options || !Array.isArray(options)) {
    return <p>Could not find options for select field {name}</p>;
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
          data-testid={id}
          {...register(name)}
          defaultValue={defaultValue || null}
          disabled={isReadOnly || isLoading}
          placeholder={placeholder}
          {...fieldStyles.select}
          {...(isLoading && {
            icon: <Spinner />,
          })}
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
