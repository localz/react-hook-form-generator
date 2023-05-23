import React, { FC, useMemo, useContext, Fragment } from 'react';
import {
  FormControl,
  FormLabel,
  ButtonGroup,
  IconButton,
  Flex,
  Collapse,
  useDisclosure,
  Box,
  Stack,
  FormHelperText,
  FormErrorMessage,
  Divider,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';
import {
  AddIcon,
  DeleteIcon,
  ViewIcon,
  ViewOffIcon,
  DragHandleIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { Ctx } from './Ctx';

import {
  FieldProps,
  ArrayFieldStyles,
  ArrayFieldSchema,
  Field,
  ObjectFieldStyles,
  ObjectFieldSchema,
  FieldSchema,
} from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { SwitchField } from './SwitchField';
import { CheckboxField } from './CheckboxField';
import { SelectField } from './SelectField';
import { TextAreaField } from './TextAreaField';
import { CodeField } from './CodeField';
import { ColorField } from './ColorField';
import DateField from './DateField';
import FileField from './FileField';
import { DragDropField } from './DragDropField';
import { HeadingField } from './HeadingField';
import { SecretField } from './SecretField';
import LabelElement from './elements/Label';

export const renderField = (
  [name, field]: [string, Field],
  id?: string,
  defaultValue?: any,
  index?: any,
  nestedIndex?: (number | undefined)[]
) => {
  let Component: any = null;

  switch (field.type) {
    case 'text':
      Component = TextField;
      break;

    case 'textArea':
      Component = TextAreaField;
      break;

    case 'code':
      Component = CodeField;
      break;

    case 'number':
      Component = NumberField;
      break;

    case 'array':
      Component = ArrayField;
      break;

    case 'object':
      Component = ObjectField;
      break;

    case 'dragDrop':
      Component = DragDropField;
      break;

    case 'switch':
      Component = SwitchField;
      break;

    case 'checkbox':
      Component = CheckboxField;
      break;

    case 'select':
      Component = SelectField;
      break;

    case 'date':
      Component = DateField;
      break;

    case 'color':
      Component = ColorField;
      break;

    case 'file':
      Component = FileField;
      break;

    case 'heading':
      Component = HeadingField;
      break;

    case 'secret':
      Component = SecretField;
      break;

    case 'custom':
      Component = field.component;
      return (
        <Fragment>
          <Component
            id={id}
            data-testid={id}
            name={name}
            field={field}
            defaultValue={defaultValue}
            index={index}
            nestedIndex={nestedIndex}
            {...field.props}
          />
        </Fragment>
      );

    default:
      break;
  }

  return (
    <Fragment>
      <Component
        id={id}
        data-testid={id}
        name={name}
        field={field}
        defaultValue={defaultValue}
        index={index}
        nestedIndex={nestedIndex}
      />
    </Fragment>
  );
};

export const arrayFieldStyles: (colorMode: string) => ArrayFieldStyles = (
  colorMode: string
) => {
  return {
    arrayContainer: {
      spacing: 4,
      marginTop: 2,
    },
    label: {
      padding: 0,
      display: 'flex',
    },
    toolbar: {
      alignItems: 'center',
    },
    buttonGroup: {
      marginLeft: 'auto',
    },
    addButton: {
      size: 'xs',
    },
    deleteButton: {
      size: 'xs',
      margin: 'auto',
    },
    clearButton: {
      size: 'xs',
    },
    dragButton: {
      size: 'xs',
      margin: 'auto',
      marginLeft: '0.5rem',
    },
    collapseButton: {
      size: 'xs',
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
      backgroundColor: colorMode === 'light' ? 'gray.50' : 'blackAlpha.300',
    },
    deleteItemContainer: {
      display: 'flex',
    },
  };
};

const emptyFields = {
  text: '',
  textArea: '',
  number: 0,
  switch: false,
  array: [],
  object: {},
  checkbox: [],
  select: {},
  code: '',
  date: '',
  custom: {},
  color: '',
  file: {},
  dragDrop: [],
  heading: '',
  secret: '',
};

export const ArrayField: FC<FieldProps<ArrayFieldSchema>> = ({
  name,
  field,
  index,
  nestedIndex,
}) => {
  const {
    label,
    labelAddon,
    isRequired,
    isCollapsible,
    defaultIsOpen,
    itemField,
    helperText,
    shouldDisplay,
    styles = {},
    divideAfter,
    hideCount,
    draggable,
    tooltip,
    disabled,
    readOnly,
    disableButtons,
  } = field;

  const { control } = useFormContext();
  const { isReadOnly } = useContext(Ctx);

  const values = useWatch({ control });

  const { fields, append, remove, move } = useFieldArray({ name, control });

  const { isOpen, onOpen, onToggle } = useDisclosure({
    defaultIsOpen: !isCollapsible || defaultIsOpen,
  });

  const arrayStyles = useStyles<ArrayFieldStyles>('arrayField', styles);

  const errorMessage = useErrorMessage(name, label);

  const addItem = () => {
    const item = emptyFields[itemField.type];

    if (!item) {
      console.error(`Invalid item type ${itemField.type}`);
      return;
    }

    append(item);
    onOpen();
  };

  const handleDrag = (result: DropResult) => {
    if (result.destination) {
      move(result.source.index, result.destination.index);
    }
  };

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index, nestedIndex) : true;
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
                {labelAddon}
                {label}
                {!hideCount && <Box marginLeft="5px">({fields?.length})</Box>}
                {Boolean(tooltip) && (
                  <Tooltip label={tooltip}>
                    <InfoIcon ml="1" />
                  </Tooltip>
                )}
              </FormLabel>
            )}
            <ButtonGroup {...arrayStyles.buttonGroup}>
              <IconButton
                icon={<AddIcon />}
                aria-label="Add item"
                onClick={addItem}
                disabled={isReadOnly || disabled || readOnly || disableButtons}
                {...arrayStyles.addButton}
              />
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Clear items"
                onClick={() => remove()}
                disabled={isReadOnly || disabled || readOnly || disableButtons}
                {...arrayStyles.clearButton}
              />
              {isCollapsible && (
                <IconButton
                  icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
                  aria-label={isOpen ? 'Hide items' : 'Show items'}
                  onClick={onToggle}
                  disabled={
                    isReadOnly || disabled || readOnly || disableButtons
                  }
                  {...arrayStyles.collapseButton}
                />
              )}
            </ButtonGroup>
          </Flex>
          <Collapse in={isOpen} style={{ overflow: 'visible' }}>
            {draggable && (
              <Droppable droppableId="test-items">
                {(provided) => (
                  <Stack
                    {...arrayStyles.arrayContainer}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {fields?.map((item, i) => {
                      const { shouldDisplay } = itemField as FieldSchema;
                      if (
                        shouldDisplay &&
                        !shouldDisplay(values, index, nestedIndex)
                      ) {
                        return null;
                      }

                      return (
                        <Draggable
                          key={`${name}[${i}]`}
                          draggableId={`${name}[${i}]`}
                          index={i}
                        >
                          {(provided) => (
                            <Box
                              key={item?.id || `${name}[${i}]`}
                              {...arrayStyles.itemContainer}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{
                                ...provided.draggableProps.style,
                                gridTemplateColumns: '1fr 2.5rem 2rem',
                              }}
                            >
                              {renderField(
                                [`${name}[${i}]`, itemField],
                                item.id,
                                item,
                                i,
                                nestedIndex ? [...nestedIndex, i] : [i]
                              )}
                              <ButtonGroup {...arrayStyles.buttonGroup}>
                                <IconButton
                                  icon={<DragHandleIcon />}
                                  aria-label="Drag item"
                                  disabled={
                                    isReadOnly ||
                                    disabled ||
                                    readOnly ||
                                    disableButtons
                                  }
                                  {...provided.dragHandleProps}
                                  {...arrayStyles.dragButton}
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  aria-label="Delete item"
                                  disabled={
                                    isReadOnly ||
                                    disabled ||
                                    readOnly ||
                                    disableButtons
                                  }
                                  onClick={() => remove(i)}
                                  {...arrayStyles.deleteButton}
                                />
                              </ButtonGroup>
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    <Box>{provided.placeholder}</Box>
                  </Stack>
                )}
              </Droppable>
            )}
            {!draggable && (
              <Collapse in={isOpen} style={{ overflow: 'visible' }}>
                <Stack {...arrayStyles.arrayContainer}>
                  {fields?.map((item, i) => {
                    const { shouldDisplay } = itemField as FieldSchema;
                    if (
                      shouldDisplay &&
                      !shouldDisplay(values, index, nestedIndex)
                    ) {
                      return null;
                    }

                    return (
                      <Box
                        key={item?.id || `${name}[${i}]`}
                        {...arrayStyles.itemContainer}
                      >
                        {renderField(
                          [`${name}[${i}]`, itemField],
                          item.id,
                          item,
                          i,
                          nestedIndex ? [...nestedIndex, i] : [i]
                        )}
                        <Box {...arrayStyles.deleteItemContainer}>
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Delete item"
                            disabled={
                              isReadOnly ||
                              disabled ||
                              readOnly ||
                              disableButtons
                            }
                            onClick={() => remove(i)}
                            {...arrayStyles.deleteButton}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Collapse>
            )}
          </Collapse>
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

export const objectFieldStyles: (colorMode: string) => ObjectFieldStyles = (
  colorMode: string
) => {
  return {
    objectContainer: {
      spacing: 4,
      borderWidth: 1,
      borderColor: 'gray.200',
      padding: 2,
      borderRadius: 4,
      marginTop: 2,
      backgroundColor: colorMode === 'light' ? 'gray.50' : 'blackAlpha.300',
    },
    label: {
      padding: 0,
    },
    toolbar: {
      alignItems: 'center',
    },
    collapseButton: {
      size: 'xs',
      marginLeft: 'auto',
    },
  };
};

export const ObjectField: FC<FieldProps<ObjectFieldSchema>> = ({
  name,
  field,
  id,
  defaultValue,
  index,
  nestedIndex,
}) => {
  const {
    label,
    labelAddon,
    isCollapsible,
    isRequired,
    helperText,
    shouldDisplay,
    styles = {},
    divideAfter,
    tooltip,
    disabled,
    readOnly,
  } = field;

  const { colorMode } = useColorMode();
  const { control } = useFormContext();
  const { isReadOnly } = useContext(Ctx);

  const values = useWatch({ control });

  const { isOpen, onToggle } = useDisclosure({
    isOpen: true,
  });

  const objectStyles = useStyles<ObjectFieldStyles>('objectField', styles);

  const errorMessage = useErrorMessage(name, field.label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index, nestedIndex) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <FormControl
        isRequired={isRequired}
        isInvalid={Boolean(errorMessage)}
        {...objectStyles.control}
      >
        <Flex {...objectStyles.toolbar}>
          <LabelElement
            label={label}
            labelAddon={labelAddon}
            name={name}
            fieldStyles={objectFieldStyles(colorMode)}
            tooltip={tooltip}
          />
          {isCollapsible && (
            <IconButton
              icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
              aria-label={isOpen ? 'Hide items' : 'Show items'}
              onClick={onToggle}
              disabled={isReadOnly || disabled || readOnly}
              {...objectStyles.collapseButton}
            />
          )}
        </Flex>
        <Collapse in={isOpen} style={{ overflow: 'visible' }}>
          <Stack {...objectStyles.objectContainer}>
            {Object.entries(field.properties)?.map(
              ([fieldName, objectField], i) => {
                const { shouldDisplay } = objectField as FieldSchema;
                if (
                  shouldDisplay &&
                  !shouldDisplay(values, index, nestedIndex)
                ) {
                  return null;
                }

                return (
                  <Box key={i} {...objectStyles.propertyContainer}>
                    {renderField(
                      [`${name}.${fieldName}`, objectField],
                      id,
                      defaultValue?.[fieldName],
                      index,
                      nestedIndex
                    )}
                  </Box>
                );
              }
            )}
          </Stack>
        </Collapse>
        {Boolean(helperText) && (
          <FormHelperText {...objectStyles.helperText}>
            {helperText}
          </FormHelperText>
        )}
        <FormErrorMessage {...objectStyles.errorMessage}>
          {errorMessage}
        </FormErrorMessage>
      </FormControl>
      {divideAfter && <Divider mt="8" />}
    </>
  );
};
