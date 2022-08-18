import React, { FC, useContext, useMemo } from 'react';
import {
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Switch,
  Divider,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FieldProps, SwitchFieldStyles, SwitchFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import LabelElement from './elements/Label';
import { Ctx } from './Ctx';

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
    divideAfter,
  } = field;

  const { register, control } = useFormContext();

  const { isReadOnly } = useContext(Ctx);

  const values = useWatch({
    control,
  });

  const fieldStyles = useStyles<SwitchFieldStyles>('switchField', styles);

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
        required
        isInvalid={!!errorMessage}
        {...fieldStyles.control}
        isReadOnly={isReadOnly}
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
