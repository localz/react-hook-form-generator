import React, { FC, useMemo } from 'react';
import {
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Switch,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { FieldProps, SwitchFieldStyles, SwitchFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import LabelElement from './elements/Label';

export const SwitchField: FC<FieldProps<SwitchFieldSchema>> = ({
  id,
  name,
  field,
}) => {
  const {
    label,
    helperText,
    isRequired,
    shouldDisplay,
    styles = {},
    defaultValue,
    tooltip,
  } = field;

  const { register, watch } = useFormContext();

  const values = watch(name);

  const fieldStyles = useStyles<SwitchFieldStyles>('switchField', styles);

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
      required
      isInvalid={!!errorMessage}
      {...fieldStyles.control}
    >
      <LabelElement
        label={label}
        name={name}
        fieldStyles={fieldStyles}
        tooltip={tooltip}
      />
      <Switch
        {...register(name)}
        data-testid={id}
        {...fieldStyles.switch}
        defaultChecked={defaultValue}
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
  );
};
