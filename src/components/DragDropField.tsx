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
  DragDropFieldSchema,
  DragDropFieldStyles,
} from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { renderField } from './Containers';
import DragDropIcon from './elements/DragDropIcon';

export const dragDropFieldStyles: DragDropFieldStyles = {
  arrayContainer: {
    spacing: 4,
    marginTop: 2,
  },
  itemContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2.5rem',
    paddingLeft: 2,
    paddingBottom: 2,
    paddingTop: 1,
    border: '1px solid',
    borderRadius: 4,
    borderColor: 'gray.200',
    backgroundColor: 'gray.50',
  },
  unselectedContainer: {
    width: '50%',
  },
  selectedContainer: {
    width: '50%',
  },
};

const UnselectedField = ({
  option,
  optionToString,
  i,
  dragDropStyles,
  isReadOnly,
  disabled,
}: {
  option: { [x: string]: any };
  optionToString: (values: { [x: string]: any }) => string;
  i: number;
  dragDropStyles: DragDropFieldStyles;
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
          width="100%"
          key={`unselectedOptions[${i}]`}
          ref={provided.innerRef}
          sx={{
            ...provided.draggableProps.style,
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...dragDropStyles.itemContainer}
        >
          <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
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
  dragDropStyles,
  isReadOnly,
  disabled,
}: {
  optionField: Field;
  name: string;
  i: number;
  item: Record<'id', string>;
  dragDropStyles: DragDropFieldStyles;
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
          width="100%"
          key={item?.id || `${name}[${i}]`}
          {...dragDropStyles.itemContainer}
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
    maxSelectedContainerHeight,
    maxUnselectedContainerHeight,
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

  const dragDropStyles = useStyles<DragDropFieldStyles>(
    'dragDropField',
    styles
  );

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
          {...dragDropStyles.control}
        >
          <Flex>
            {Boolean(label) && (
              <FormLabel htmlFor={name} {...dragDropStyles.label}>
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
              {...(maxSelectedContainerHeight && {
                maxHeight: maxSelectedContainerHeight,
                overflow: 'scroll',
              })}
              {...dragDropStyles.selectedContainer}
            >
              <Droppable droppableId="selectedDroppable">
                {(provided) => (
                  <Stack
                    {...dragDropStyles.arrayContainer}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    margin={selectedFields.length === 0 ? 4 : 2}
                    alignItems="center"
                  >
                    {selectedFields.length === 0 && (
                      <>
                        <DragDropIcon />
                        <Text color="gray.400" textAlign="center">
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
                        dragDropStyles={dragDropStyles}
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
              {...(maxUnselectedContainerHeight && {
                maxHeight: maxUnselectedContainerHeight,
                overflow: 'scroll',
              })}
              {...dragDropStyles.unselectedContainer}
            >
              <Droppable droppableId="unselectedDroppable">
                {(provided) => (
                  <Stack
                    {...dragDropStyles.arrayContainer}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    margin={unselectedFields.length === 0 ? 4 : 2}
                    alignItems="center"
                  >
                    {unselectedFields.length === 0 && (
                      <>
                        <Text color="gray.400" textAlign="center">
                          {noOptionsText ?? 'No options left'}
                        </Text>
                      </>
                    )}
                    {unselectedFields.map((option, i) => (
                      <UnselectedField
                        i={i}
                        option={option}
                        optionToString={optionToString}
                        dragDropStyles={dragDropStyles}
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
            <FormHelperText {...dragDropStyles.helperText}>
              {helperText}
            </FormHelperText>
          )}
          <FormErrorMessage {...dragDropStyles.errorMessage}>
            {errorMessage}
          </FormErrorMessage>
        </FormControl>
        {divideAfter && <Divider mt="8" />}
      </>
    </DragDropContext>
  );
};
