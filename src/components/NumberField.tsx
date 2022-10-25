import React, { FC, useContext, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  Divider,
} from '@chakra-ui/react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';

import { FieldProps, FieldStyles, NumberFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

export const NumberField: FC<FieldProps<NumberFieldSchema>> = ({
  id,
  name,
  field,
  index,
}) => {
  const {
    label,
    helperText,
    isRequired,
    shouldDisplay,
    styles = {},
    divideAfter,
    defaultValue,
    min,
    max,
    format,
    parse,
    precision,
    step,
    disabled,
    readOnly,
  } = field;

  const { isReadOnly } = useContext(Ctx);

  const fieldStyles = useStyles<FieldStyles>('numberField', styles);

  const { control } = useFormContext();

  const values = useWatch({
    control,
  });

  const errorMessage = useErrorMessage(name, label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index) : true;
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
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <NumberInput
              isDisabled={disabled}
              isReadOnly={isReadOnly || readOnly}
              defaultValue={defaultValue}
              value={format ? format(value) : value}
              onChange={(val: string) => onChange(parse ? parse(val) : val)}
              min={min}
              max={max}
              precision={precision}
              step={step}
            >
              <NumberInputField id={id} data-testid={id} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        {helperText && (
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
