import React, { FC, useContext, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  Input,
  FormHelperText,
  Divider,
  Tooltip,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
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
    copyToClipboard,
    onCopy,
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
              <InfoIcon mx={2} />
            </Tooltip>
          )}
          {copyToClipboard && (
            <IconButton
              icon={<CopyIcon />}
              aria-label="copy-value"
              size="xs"
              marginLeft={0}
              onClick={() => {
                navigator.clipboard.writeText(values[name]);
                onCopy && onCopy();
              }}
              {...fieldStyles.button}
            />
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
