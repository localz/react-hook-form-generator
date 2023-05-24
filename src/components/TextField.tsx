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
import { isNil } from 'lodash';

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
  nestedIndex,
}) => {
  const {
    label,
    labelAddon,
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
    onCopy,
    onCopyError,
    inputValidation,
    deriveValue,
    variant,
  } = field;

  const { isReadOnly } = useContext(Ctx);

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

  const { register, control, setError, clearErrors } = useFormContext();
  const errorMessage = useErrorMessage(name, label);

  const values = useWatch({
    control,
  });
  const debouncedValue = useDebounce(values[name], 500);

  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (inputValidation) {
      const { validator, validationError } = inputValidation;
      const validate = async () => {
        const passed = await validator(debouncedValue);
        setValid(passed);
        if (!passed && validationError) {
          setError(name, { message: validationError });
        } else {
          clearErrors(name);
        }
      };
      if (!isNil(debouncedValue)) {
        validate();
      }
    }
  }, [debouncedValue]);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index, nestedIndex) : true;
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
          labelAddon={labelAddon}
          name={name}
          fieldStyles={fieldStyles}
          tooltip={tooltip}
        />
        {leftInputAddon ||
        rightInputAddon ||
        copyToClipboard ||
        inputValidation ? (
          <InputGroup {...fieldStyles.inputGroup}>
            {inputValidation && (
              <InputLeftElement
                zIndex="unset"
                children={
                  inputValidation.loading ? (
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
              {...register(name, {
                ...(inputValidation && {
                  validate: async (v) => inputValidation.validator(v),
                }),
              })}
              placeholder={placeholder}
              defaultValue={defaultValue || ''}
              {...(deriveValue && {
                value: deriveValue(values, index, nestedIndex),
              })}
              {...fieldStyles.input}
              isDisabled={disabled}
              isReadOnly={isReadOnly || readOnly}
              variant={variant}
            />
            {Boolean(rightInputAddon) && (
              <InputRightAddon {...rightInputAddon} />
            )}
            {copyToClipboard && (
              <InputRightAddon
                children={
                  <IconButton
                    icon={<CopyIcon />}
                    aria-label="copy-value"
                    size="xs"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(values[name]);
                        onCopy && onCopy();
                      } catch (e) {
                        onCopyError && onCopyError();
                      }
                    }}
                    {...fieldStyles.button}
                  />
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
            variant={variant}
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
