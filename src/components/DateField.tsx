import React, { FC, forwardRef, useContext, useMemo } from 'react';
import { InputGroup, Input, InputRightElement } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/datepicker.css';
import { useColorMode } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Divider,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { FieldProps, FieldStyles, DateFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

const customDateInput = (
  { value, onClick, onChange, placeholder }: any,
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
  />
);
customDateInput.displayName = 'DateInput';

const CustomInput = forwardRef(customDateInput);

interface Props {
  isClearable?: boolean;
  onChange: (date: Date) => any;
  selectedDate: Date | undefined;
  showPopperArrow?: boolean;
  props?: ReactDatePickerProps;
  dateFormat?: string;
  placeholder?: string;
  showTime?: boolean;
  timeOnly?: boolean;
}

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  dateFormat = 'MM/dd/yyyy',
  placeholder,
  showTime,
  timeOnly,
  ...props
}: Props) => {
  const isLight = useColorMode().colorMode === 'light';
  return (
    <>
      <InputGroup className={isLight ? 'light-theme' : 'dark-theme'}>
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          isClearable={isClearable}
          showPopperArrow={false}
          className="react-datapicker__input-text"
          dateFormat={dateFormat}
          customInput={<CustomInput />}
          placeholderText={placeholder}
          showTimeSelect={showTime}
          showTimeSelectOnly={timeOnly}
          {...props}
        />
        <InputRightElement
          color="gray.500"
          children={<CalendarIcon fontSize="sm" />}
        />
      </InputGroup>
    </>
  );
};

export const DateField: FC<FieldProps<DateFieldSchema>> = ({ name, field }) => {
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
  } = field;

  const { isReadOnly } = useContext(Ctx);

  const { watch, setValue } = useFormContext();

  const values = watch(name);

  const fieldStyles = useStyles<FieldStyles>('textAreaField', styles);

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
          selectedDate={values}
          onChange={(value: Date) => {
            setValue(name, value);
          }}
          isClearable={isClearable}
          dateFormat={format}
          placeholder={placeholder}
          showTime={showTime}
          timeOnly={timeOnly}
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
