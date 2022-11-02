import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
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
  IconButton,
  InputLeftElement,
  Spinner,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import CopyToClipboard from 'react-copy-to-clipboard';

import { FieldProps, FieldStyles, TextFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import useDebounce from '../hooks/useDebounce';
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
    copyToClipboard,
    validateOnChange,
    loadingValidate,
  } = field;

  const { isReadOnly } = useContext(Ctx);

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

  const { register, control, watch } = useFormContext();

  const errorMessage = useErrorMessage(name, label);

  const values = useWatch({
    control,
  });
  const value = watch(name);
  const debouncedValue = useDebounce(value, 500);

  const [valid, setValid] = useState(true);

  useEffect(() => {
    const validate = async () => {
      if (validateOnChange) {
        const passed = await validateOnChange(debouncedValue);
        setValid(passed);
      }
    };
    if (debouncedValue) {
      validate();
    }
  }, [debouncedValue]);

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
        {leftInputAddon ||
        rightInputAddon ||
        copyToClipboard ||
        validateOnChange ? (
          <InputGroup {...fieldStyles.inputGroup}>
            {validateOnChange && (
              <InputLeftElement
                children={
                  loadingValidate ? (
                    <Spinner size="sm" color="orange" />
                  ) : valid ? (
                    <CheckIcon color="green.500" />
                  ) : (
                    <WarningIcon color="red.500" />
                  )
                }
              />
            )}
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
            {Boolean(rightInputAddon) && (
              <InputRightAddon {...rightInputAddon} />
            )}
            {copyToClipboard && (
              <InputRightAddon
                children={
                  <CopyToClipboard text={value}>
                    <IconButton
                      icon={<CopyIcon />}
                      aria-label="copy-value"
                      disabled={isReadOnly || disabled || readOnly}
                      size="xs"
                      {...fieldStyles.button}
                    />
                  </CopyToClipboard>
                }
              />
            )}
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
