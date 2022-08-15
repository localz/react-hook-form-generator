import React, { forwardRef } from 'react';
import { InputGroup, Input, InputRightElement } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/datepicker.css';
import { useColorMode } from '@chakra-ui/react';

const customDateInput = ({ value, onClick, onChange }: any, ref: any) => (
  <Input
    autoComplete="off"
    background="white"
    value={value}
    ref={ref}
    onClick={onClick}
    onChange={onChange}
  />
);
customDateInput.displayName = 'DateInput';

const CustomInput = forwardRef(customDateInput);

const icon = <CalendarIcon fontSize="sm" />;

interface Props {
  isClearable?: boolean;
  onChange: (date: Date) => any;
  selectedDate: Date | undefined;
  showPopperArrow?: boolean;
  props?: ReactDatePickerProps;
}

export const DateField = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
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
          showPopperArrow={showPopperArrow}
          className="react-datapicker__input-text"
          dateFormat="MM/dd/yyyy"
          customInput={<CustomInput />}
          {...props}
        />
        <InputRightElement color="gray.500" children={icon} />
      </InputGroup>
    </>
  );
};

export default DateField;
