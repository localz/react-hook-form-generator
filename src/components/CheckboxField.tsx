import React, { FC, useContext, useMemo } from 'react';
import {
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Checkbox,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';

import { FieldProps, CheckboxFieldSchema, CheckboxFieldStyles } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';
import LabelElement from './elements/Label';

export const checkboxFieldStyles: CheckboxFieldStyles = {
  checkboxGroup: {
    isInline: true,
    spacing: 4,
  },
};

export const CheckboxField: FC<FieldProps<CheckboxFieldSchema>> = ({
  id,
  name,
  field,
  index,
}) => {
  const {
    label,
    labelAddon,
    helperText,
    tooltip,
    isRequired,
    shouldDisplay,
    styles = {},
    divideAfter,
    disabled,
    readOnly,
  } = field;

  const { register, control } = useFormContext();

  const { isReadOnly } = useContext(Ctx);

  const values = useWatch({ control });

  const fieldStyles = useStyles<CheckboxFieldStyles>('checkboxField', styles);

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
        isInvalid={!!errorMessage}
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
        <Stack {...fieldStyles.checkboxGroup}>
          {(field.checkboxes || []).map((checkbox) => (
            <Checkbox
              isDisabled={disabled}
              isReadOnly={isReadOnly || readOnly}
              key={checkbox.name}
              {...register(checkbox.name)}
              data-testid={`${id}-${checkbox.name}`}
            >
              {checkbox.label || checkbox.name}
            </Checkbox>
          ))}
        </Stack>
        {!!helperText && (
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
