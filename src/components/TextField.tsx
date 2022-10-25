import React, { FC, useContext, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightAddon,
  FormHelperText,
  FormErrorMessage,
  Divider,
} from '@chakra-ui/react';

import { FieldProps, FieldStyles, TextFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import LabelElement from './elements/Label';
import { Ctx } from './Ctx';

export const TextField: FC<FieldProps<TextFieldSchema>> = ({
  id,
  name,
  field,
  index,
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
    renderAfter,
    disabled,
    readOnly,
  } = field;

  const { isReadOnly } = useContext(Ctx);

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

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
              isDisabled={disabled}
              isReadOnly={isReadOnly || readOnly}
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
            isDisabled={isReadOnly || disabled}
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

      {renderAfter && renderAfter(values)}

      {divideAfter && <Divider mt="8" />}
    </>
  );
};
