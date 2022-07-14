import React, { FC, useContext, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Divider,
} from '@chakra-ui/react';
import JSONInput from 'react-json-editor-ajrm';
// @ts-ignore
import locale from 'react-json-editor-ajrm/locale/en';

import { FieldProps, FieldStyles, JsonFieldSchema } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

export const JsonField: FC<FieldProps<JsonFieldSchema>> = ({ name, field }) => {
  const {
    label,
    helperText,
    isRequired,
    shouldDisplay,
    styles = {},
    divideAfter,
    placeholder,
  } = field;

  const fieldStyles = useStyles<FieldStyles>('textAreaField', styles);

  const { isReadOnly } = useContext(Ctx);

  const { watch, setValue } = useFormContext();

  const errorMessage = useErrorMessage(name, label);

  const values = watch(name);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <FormControl
        isRequired={isRequired}
        isInvalid={!!errorMessage}
        {...fieldStyles.control}
        isReadOnly={isReadOnly}
      >
        {Boolean(label) && (
          <FormLabel htmlFor={name} {...fieldStyles.label}>
            {label}
          </FormLabel>
        )}
        <JSONInput
          id="workflowBuffer"
          theme="light_mitsuketa_tribute"
          locale={locale}
          reset={false}
          placeholder={placeholder}
          height="200px"
          width="100%"
          onChange={(value: { jsObject: any }) => {
            setValue(name, value.jsObject);
          }}
          style={{
            labelColumn: {
              fontSize: '1rem',
            },
            outerBox: {},
            contentBox: {
              fontSize: '1rem',
              color: 'rgb(26, 32, 44)',
            },
            body: {
              borderRadius: '4px',
              border: 'solid 1px rgb(226, 232, 240)',
            },
          }}
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
