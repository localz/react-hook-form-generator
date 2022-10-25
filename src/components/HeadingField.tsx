import React, { FC, useContext, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  Input,
  FormHelperText,
  Divider,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

import { FieldProps, FieldStyles, HeadingFieldSchema } from '../types';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

export const HeadingField: FC<FieldProps<HeadingFieldSchema>> = ({
  id,
  name,
  field,
  index,
}) => {
  const {
    placeholder,
    helperText,
    shouldDisplay,
    styles = {},
    tooltip,
    divideAfter,
  } = field;

  const { isReadOnly } = useContext(Ctx);

  const fieldStyles = useStyles<FieldStyles>('headingField', styles);

  const { register, control } = useFormContext();

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
      <FormControl {...fieldStyles.control} isReadOnly={isReadOnly}>
        <Flex>
          <Input
            data-testid={id}
            type="text"
            aria-label={name}
            {...register(name)}
            placeholder={placeholder}
            defaultValue=""
            variant="unstyled"
            isReadOnly
            {...fieldStyles.input}
          />
          {Boolean(tooltip) && (
            <Tooltip label={tooltip}>
              <InfoIcon ml="1" />
            </Tooltip>
          )}
        </Flex>
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
