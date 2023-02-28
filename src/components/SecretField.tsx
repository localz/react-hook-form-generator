import React, { FC, useContext, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  InputGroup,
  Input,
  InputRightAddon,
  FormHelperText,
  Divider,
  IconButton,
} from '@chakra-ui/react';

import { FieldProps, FieldStyles, SecretFieldSchema } from '../types';
import { useStyles } from '../hooks/useStyles';
import LabelElement from './elements/Label';
import { Ctx } from './Ctx';
import { CopyIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';

export const SecretField: FC<FieldProps<SecretFieldSchema>> = ({
  id,
  name,
  field,
  index,
  nestedIndex,
}) => {
  const {
    label,
    placeholder,
    defaultValue,
    shouldDisplay,
    styles = {},
    tooltip,
    divideAfter,
    helperText,
    disabled,
    readOnly,
    clearOriginalValue,
    copyToClipboard,
    onCopy,
  } = field;

  const { isReadOnly } = useContext(Ctx);

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

  const { register, control, setValue } = useFormContext();

  const values = useWatch({
    control,
  });

  const [show, setShow] = useState(false);
  const [modified, setModified] = useState(false);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index, nestedIndex) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <FormControl {...fieldStyles.control} isReadOnly={isReadOnly}>
        <LabelElement
          label={label}
          name={name}
          fieldStyles={fieldStyles}
          tooltip={tooltip}
        />
        <InputGroup {...fieldStyles.inputGroup}>
          <Input
            data-testid={id}
            type={show ? 'text' : 'password'}
            aria-label={name}
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled || !show}
            readOnly={readOnly}
            defaultValue={defaultValue}
            {...fieldStyles.input}
          />
          {copyToClipboard && (
            <InputRightAddon
              children={
                <IconButton
                  icon={<CopyIcon />}
                  aria-label="copy-value"
                  size="xs"
                  onClick={() => {
                    navigator.clipboard.writeText(values[name]);
                    onCopy && onCopy();
                  }}
                  {...fieldStyles.button}
                />
              }
            />
          )}
          <InputRightAddon
            children={
              <IconButton
                icon={show ? <UnlockIcon /> : <LockIcon />}
                aria-label="unlock-field"
                size="xs"
                onClick={() => {
                  if (clearOriginalValue) {
                    !show && !modified && setValue(name, '');
                    !modified && setModified(true);
                  }
                  setShow(!show);
                }}
                {...fieldStyles.button}
              />
            }
          />
        </InputGroup>
        {Boolean(helperText) && (
          <FormHelperText {...fieldStyles.helperText}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>

      {divideAfter && <Divider mt={2} />}
    </>
  );
};
