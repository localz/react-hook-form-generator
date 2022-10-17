import React, { FC, useContext, useMemo } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Divider,
  Square,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import LabelElement from './elements/Label';
import { FieldProps, ColorFieldSchema, FieldStyles } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

export const ColorField: FC<FieldProps<ColorFieldSchema>> = ({
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
    tooltip,
    placeholder,
    defaultValue,
    disabled,
  } = field;

  const { register, control, setValue } = useFormContext();

  const { isReadOnly } = useContext(Ctx);

  const values = useWatch({ control });

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

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
          name={name}
          fieldStyles={fieldStyles}
          tooltip={tooltip}
        />
        <Popover placement="bottom-start">
          {/* @ts-ignore */}
          <PopoverTrigger>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={
                  <Square
                    size={6}
                    bg={values[name]}
                    borderRadius={4}
                    border="1px solid #EAEAEA"
                  />
                }
                zIndex={0}
              />
              <Input
                data-testid={id}
                aria-label={name}
                {...register(name)}
                placeholder={placeholder}
                defaultValue={defaultValue || ''}
                {...fieldStyles.input}
                isDisabled={isReadOnly || disabled}
              />
            </InputGroup>
          </PopoverTrigger>
          {!isReadOnly && !disabled && (
            <PopoverContent width="fit-content">
              <PopoverArrow placeSelf="flex-start" />
              <HexColorPicker
                color={values[name] || ''}
                onChange={(color: string) => setValue(name, color)}
              />
            </PopoverContent>
          )}
        </Popover>
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
