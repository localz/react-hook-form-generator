import React, { FC, useContext, useMemo } from 'react';
import {
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { Select } from 'chakra-react-select';
import { FieldProps, SelectFieldSchema, SelectFieldStyles } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';
import LabelElement from './elements/Label';

export const SelectField: FC<FieldProps<SelectFieldSchema>> = ({
  id,
  name,
  field,
  index,
  nestedIndex,
}) => {
  const {
    label,
    labelAddon,
    helperText,
    tooltip,
    isRequired,
    shouldDisplay,
    defaultValue,
    styles = {},
    divideAfter,
    placeholder,
    disabled,
    readOnly,
    generateOptions,
    renderAfter,
    ...selectProps
  } = field;

  const { isReadOnly, selectOptions } = useContext(Ctx);

  const { control } = useFormContext();

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    ...(defaultValue && { defaultValue }),
  });

  const values = useWatch({
    control,
  });

  const fieldStyles = useStyles<SelectFieldStyles>('selectField', styles);

  const errorMessage = useErrorMessage(name, label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index, nestedIndex) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  const isLoading = field.selectKey
    ? selectOptions[field.selectKey].isLoading
    : false;

  const options = field.selectKey
    ? selectOptions[field.selectKey].options
    : generateOptions
    ? generateOptions(values, index, nestedIndex)
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
        <LabelElement
          label={label}
          labelAddon={labelAddon}
          name={name}
          fieldStyles={fieldStyles}
          tooltip={tooltip}
        />

        <Select
          data-testid={id}
          name={name}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          isDisabled={isLoading || disabled}
          isReadOnly={isReadOnly || readOnly}
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...selectProps}
          {...fieldStyles.select}
          {...(isLoading && {
            icon: <Spinner />,
          })}
          options={options}
        />
        <FormErrorMessage>{error && error.message}</FormErrorMessage>
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
