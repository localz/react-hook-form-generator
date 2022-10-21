import React, { FC, useMemo, useContext } from 'react';
import {
  FormControl,
  FormLabel,
  Flex,
  Box,
  Stack,
  FormHelperText,
  FormErrorMessage,
  Divider,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import {
  useFormContext,
  useFieldArray,
  useWatch,
  useForm,
} from 'react-hook-form';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { Ctx } from './Ctx';
import { differenceBy } from 'lodash';

import {
  Field,
  FieldProps,
  ArrayFieldStyles,
  DragDropFieldSchema,
} from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { renderField } from './Containers';
import DragDropIcon from './elements/DragDropIcon';

const UnselectedField = ({
  option,
  optionToString,
  i,
  arrayStyles,
  isReadOnly,
  disabled,
}: {
  option: { [x: string]: any };
  optionToString: (values: { [x: string]: any }) => string;
  i: number;
  arrayStyles: ArrayFieldStyles;
  isReadOnly: boolean;
  disabled?: boolean;
}) => {
  return (
    <Draggable
      key={`unselectedOptions[${i}]`}
      draggableId={`unselectedOptions[${i}]`}
      index={i}
      isDragDisabled={isReadOnly || disabled}
    >
      {(provided) => (
        <Box
          key={`unselectedOptions[${i}]`}
          {...arrayStyles.itemContainer}
          ref={provided.innerRef}
          sx={{
            ...provided.draggableProps.style,
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Text
            width="150px"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {optionToString(option)}
          </Text>
        </Box>
      )}
    </Draggable>
  );
};

const SelectedField = ({
  optionField,
  name,
  i,
  item,
  arrayStyles,
  isReadOnly,
  disabled,
}: {
  optionField: Field;
  name: string;
  i: number;
  item: Record<'id', string>;
  arrayStyles: ArrayFieldStyles;
  isReadOnly: boolean;
  disabled?: boolean;
}) => {
  return (
    <Draggable
      key={`${name}[${i}]`}
      draggableId={`${name}[${i}]`}
      index={i}
      isDragDisabled={isReadOnly || disabled}
    >
      {(provided) => (
        <Box
          key={item?.id || `${name}[${i}]`}
          {...arrayStyles.itemContainer}
          ref={provided.innerRef}
          sx={{
            ...provided.draggableProps.style,
            gridTemplateColumns: '1fr 1rem',
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {renderField([`${name}[${i}]`, optionField], item.id, item, i)}
        </Box>
      )}
    </Draggable>
  );
};

export const DragDropField: FC<FieldProps<DragDropFieldSchema>> = ({
  name,
  field,
  index,
}) => {
  const {
    label,
    isRequired,
    optionField,
    optionToString,
    options,
    helperText,
    shouldDisplay,
    styles = {},
    divideAfter,
    tooltip,
    disabled,
    dragText,
    noOptionsText,
  } = field;

  const { control } = useFormContext();
  const { isReadOnly } = useContext(Ctx);

  const values = useWatch({ control });
  const { control: unselectedControl } = useForm({
    defaultValues: {
      unselectedOptions: differenceBy(options, values[name], optionToString),
    },
  });

  const {
    fields: unselectedFields,
    remove: removeUnselected,
    move: moveUnselected,
    insert: insertUnselected,
  } = useFieldArray({ name: 'unselectedOptions', control: unselectedControl });
  const {
    fields: selectedFields,
    remove: removeSelected,
    move: moveSelected,
    insert: insertSelected,
  } = useFieldArray({ name, control });

  const arrayStyles = useStyles<ArrayFieldStyles>('arrayField', styles);

  const errorMessage = useErrorMessage(name, label);

  const handleDrag = (result: DropResult) => {
    const { source, destination } = result;

    // nothing has been moved
    if (!destination) {
      return;
    }

    if (
      source.droppableId === 'unselectedDroppable' &&
      source.droppableId === destination.droppableId
    ) {
      // reordering in "unselected" list
      moveUnselected(source.index, destination.index);
    } else if (
      source.droppableId === 'selectedDroppable' &&
      source.droppableId === destination.droppableId
    ) {
      // reordering in "selected" list
      moveSelected(source.index, destination.index);
    } else if (destination.droppableId === 'selectedDroppable') {
      // move to "selected" list
      insertSelected(destination.index, unselectedFields[source.index]);
      removeUnselected(source.index);
    } else if (destination.droppableId === 'unselectedDroppable') {
      // move to "unselected" list
      insertUnselected(destination.index, selectedFields[source.index]);
      removeSelected(source.index);
    }
  };

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <>
        <FormControl
          isRequired={isRequired}
          isInvalid={Boolean(errorMessage)}
          {...arrayStyles.control}
        >
          <Flex {...arrayStyles.toolbar}>
            {Boolean(label) && (
              <FormLabel htmlFor={name} {...arrayStyles.label}>
                {label}
                {Boolean(tooltip) && (
                  <Tooltip label={tooltip}>
                    <InfoIcon ml="1" />
                  </Tooltip>
                )}
              </FormLabel>
            )}
          </Flex>
          <Flex
            flexDirection="row"
            columnGap={5}
            alignItems="center"
            alignContent="center"
          >
            <Box
              borderColor="gray.300"
              borderStyle="dashed"
              borderWidth="2px"
              rounded="md"
              shadow="sm"
              role="group"
              transition="all 150ms ease-in-out"
              flexDirection="column"
            >
              <Droppable droppableId="selectedDroppable">
                {(provided) => (
                  <Stack
                    {...arrayStyles.arrayContainer}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    margin={selectedFields.length === 0 ? 4 : 2}
                    alignItems="center"
                  >
                    {selectedFields.length === 0 && (
                      <>
                        <DragDropIcon />
                        <Text color="gray.400">
                          {dragText ?? 'Drag and drop here'}
                        </Text>
                      </>
                    )}
                    {selectedFields.map((item, i) => (
                      <SelectedField
                        optionField={optionField}
                        name={name}
                        i={i}
                        item={item}
                        arrayStyles={arrayStyles}
                        isReadOnly={isReadOnly}
                        disabled={disabled}
                      />
                    ))}
                    <Box marginTop="0!important">{provided.placeholder}</Box>
                  </Stack>
                )}
              </Droppable>
            </Box>
            <Box
              borderColor="gray.300"
              borderWidth="2px"
              rounded="md"
              shadow="sm"
              role="group"
              transition="all 150ms ease-in-out"
              flexDirection="column"
            >
              <Droppable droppableId="unselectedDroppable">
                {(provided) => (
                  <Stack
                    {...arrayStyles.arrayContainer}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    margin={unselectedFields.length === 0 ? 4 : 2}
                    alignItems="center"
                  >
                    {unselectedFields.length === 0 && (
                      <>
                        <Text color="gray.400">
                          {noOptionsText ?? 'No options left'}
                        </Text>
                      </>
                    )}
                    {unselectedFields.map((option, i) => (
                      <UnselectedField
                        i={i}
                        option={option}
                        optionToString={optionToString}
                        arrayStyles={arrayStyles}
                        isReadOnly={isReadOnly}
                        disabled={disabled}
                      />
                    ))}
                    <Box marginTop="0!important">{provided.placeholder}</Box>
                  </Stack>
                )}
              </Droppable>
            </Box>
          </Flex>
          {Boolean(helperText) && (
            <FormHelperText {...arrayStyles.helperText}>
              {helperText}
            </FormHelperText>
          )}
          <FormErrorMessage {...arrayStyles.errorMessage}>
            {errorMessage}
          </FormErrorMessage>
        </FormControl>
        {divideAfter && <Divider mt="8" />}
      </>
    </DragDropContext>
  );
};
