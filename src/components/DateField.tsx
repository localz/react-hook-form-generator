import React, { FC, forwardRef, useContext, useMemo } from 'react';
import {
  InputGroup,
  Input,
  InputRightElement,
  InputProps,
} from '@chakra-ui/react';
import { CalendarIcon, CloseIcon } from '@chakra-ui/icons';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { useColorMode } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Divider,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FieldProps, FieldStyles, DateFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

import 'react-datepicker/dist/react-datepicker.css';
import './styles/datepicker.css';

const customDateInput = (
  {
    value,
    onClick,
    onChange,
    placeholder,
    disabled,
    fieldStyles,
  }: Pick<InputProps, 'value' | 'onClick' | 'onChange' | 'placeholder'> & {
    disabled?: boolean;
    fieldStyles: FieldStyles;
  },
  ref: any
) => (
  <Input
    autoComplete="off"
    background="white"
    value={value}
    ref={ref}
    onClick={onClick}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    {...fieldStyles.input}
  />
);
customDateInput.displayName = 'DateInput';

const CustomInput = forwardRef(customDateInput);

interface Props {
  isClearable?: boolean;
  onChange: (date: Date | null) => any;
  selectedDate: Date | undefined;
  fieldStyles: FieldStyles;
  showPopperArrow?: boolean;
  dateFormat?: string;
  placeholder?: string;
  showTime?: boolean;
  timeOnly?: boolean;
  timeInterval?: number;
  disabled?: boolean;
  pickerProps?: ReactDatePickerProps;
}

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  dateFormat = 'MM/dd/yyyy',
  placeholder,
  showTime,
  timeOnly,
  timeInterval = 30,
  disabled = false,
  fieldStyles,
  ...pickerProps
}: Props) => {
  const isLight = useColorMode().colorMode === 'light';
  return (
    <>
      <InputGroup className={isLight ? 'light-theme' : 'dark-theme'}>
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          showPopperArrow={false}
          className="react-datapicker__input-text"
          dateFormat={dateFormat}
          customInput={<CustomInput fieldStyles={fieldStyles} />}
          placeholderText={placeholder}
          showTimeSelect={showTime}
          showTimeSelectOnly={timeOnly}
          timeIntervals={timeInterval}
          disabled={disabled}
          {...pickerProps}
        />
        {isClearable && !disabled ? (
          <InputRightElement
            color="gray.500"
            children={<CloseIcon fontSize="sm" cursor="pointer" />}
            onClick={() => onChange(null)}
          />
        ) : (
          <InputRightElement
            color="gray.500"
            children={<CalendarIcon fontSize="sm" />}
          />
        )}
      </InputGroup>
    </>
  );
};

export const DateField: FC<FieldProps<DateFieldSchema>> = ({
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
    placeholder,
    format,
    isClearable,
    showTime,
    timeOnly,
    timeInterval,
    pickerProps,
    defaultValue,
    disabled,
  } = field;

  const { isReadOnly } = useContext(Ctx);

  const { control, setValue } = useFormContext();

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
        isInvalid={Boolean(errorMessage)}
        {...fieldStyles.control}
        isReadOnly={isReadOnly}
      >
        {Boolean(label) && (
          <FormLabel htmlFor={name} {...fieldStyles.label}>
            {label}
          </FormLabel>
        )}
        <DatePicker
          selectedDate={values[name] || defaultValue}
          onChange={(value: Date | null) => {
            setValue(name, value);
          }}
          isClearable={isClearable}
          dateFormat={format}
          placeholder={placeholder}
          showTime={showTime}
          timeOnly={timeOnly}
          timeInterval={timeInterval}
          disabled={isReadOnly || disabled}
          pickerProps={pickerProps}
          fieldStyles={fieldStyles}
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

export default DateField;
