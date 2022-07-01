import React from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import { Flex, FormLabel, Tooltip } from '@chakra-ui/react';
import { FieldStyles, ArrayFieldStyles, ObjectFieldStyles } from '../../types';

function LabelElement({
  label,
  tooltip,
  fieldStyles,
  name,
}: {
  label?: string;
  tooltip?: string;
  fieldStyles: FieldStyles | ArrayFieldStyles | ObjectFieldStyles;
  name: string;
}) {
  if (!label) {
    return null;
  }

  return (
    <Flex>
      <FormLabel
        display="flex"
        alignItems="center"
        htmlFor={name}
        {...fieldStyles.label}
      >
        {label}
        {Boolean(tooltip) && (
          <Tooltip label={tooltip}>
            <InfoIcon ml="1" />
          </Tooltip>
        )}
      </FormLabel>
    </Flex>
  );
}

export default LabelElement;
