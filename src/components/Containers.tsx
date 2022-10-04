import React, { FC, useMemo, Fragment } from 'react';
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
} from '@chakra-ui/react';
import {
  AddIcon,
  DeleteIcon,
  ViewIcon,
  ViewOffIcon,
  DragHandleIcon,
} from '@chakra-ui/icons';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

import {
  FieldProps,
  ArrayFieldStyles,
  ArrayFieldSchema,
  Field,
  ObjectFieldStyles,
  ObjectFieldSchema,
} from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { SwitchField } from './SwitchField';
import { CheckboxField } from './CheckboxField';
import { SelectField } from './SelectField';
import { TextAreaField } from './TextAreaField';
import { JsonField } from './JsonField';
import { ColorField } from './ColorField';
import DateField from './DateField';

const renderField = (
  [name, field]: [string, Field],
  id?: string,
  defaultValue?: any
) => {
  let Component: any = null;

  switch (field.type) {
    case 'text':
      Component = TextField;
      break;

    case 'textArea':
      Component = TextAreaField;
      break;

    case 'json':
      Component = JsonField;
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
      />
    </Fragment>
  );
};

export const arrayFieldStyles: ArrayFieldStyles = {
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
    backgroundColor: 'gray.50',
  },
  deleteItemContainer: {
    display: 'flex',
  },
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
  json: {},
  date: '',
  custom: {},
  color: '',
};

export const ArrayField: FC<FieldProps<ArrayFieldSchema>> = ({
  name,
  field,
}) => {
  const {
    label,
    isRequired,
    isCollapsable,
    defaultIsOpen,
    itemField,
    helperText,
    shouldDisplay,
    styles = {},
    divideAfter,
    hideCount,
    draggable,
  } = field;

  const { control } = useFormContext();

  const values = useWatch({ control });

  const { fields, append, remove, move } = useFieldArray({ name, control });

  const { isOpen, onOpen, onToggle } = useDisclosure({
    defaultIsOpen: !isCollapsable || defaultIsOpen,
  });

  const arrayStyles = useStyles<ArrayFieldStyles>('arrayField', styles);

  const errorMessage = useErrorMessage(name, label);

  const addItem = () => {
    append(emptyFields[itemField.type]);
    onOpen();
  };

  const handleDrag = (result: DropResult) => {
    if (result.destination) {
      move(result.source.index, result.destination.index);
    }
  };

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
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
                {!hideCount && <Box marginLeft="5px">({fields.length})</Box>}
              </FormLabel>
            )}
            <ButtonGroup {...arrayStyles.buttonGroup}>
              <IconButton
                icon={<AddIcon />}
                aria-label="Add item"
                onClick={addItem}
                {...arrayStyles.addButton}
              />
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Clear items"
                onClick={() => remove()}
                {...arrayStyles.clearButton}
              />
              {isCollapsable && (
                <IconButton
                  icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
                  aria-label={isOpen ? 'Hide items' : 'Show items'}
                  onClick={onToggle}
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
                    {fields.map((item, i) => (
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
                              item
                            )}
                            <ButtonGroup {...arrayStyles.buttonGroup}>
                              <IconButton
                                icon={<DragHandleIcon />}
                                aria-label="Drag item"
                                {...provided.dragHandleProps}
                                {...arrayStyles.dragButton}
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                aria-label="Delete item"
                                onClick={() => remove(i)}
                                {...arrayStyles.deleteButton}
                              />
                            </ButtonGroup>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    <Box>{provided.placeholder}</Box>
                  </Stack>
                )}
              </Droppable>
            )}
            {!draggable && (
              <Collapse in={isOpen} style={{ overflow: 'visible' }}>
                <Stack {...arrayStyles.arrayContainer}>
                  {fields.map((item, i) => (
                    <Box
                      key={item?.id || `${name}[${i}]`}
                      {...arrayStyles.itemContainer}
                    >
                      {renderField([`${name}[${i}]`, itemField], item.id, item)}
                      <Box {...arrayStyles.deleteItemContainer}>
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete item"
                          onClick={() => remove(i)}
                          {...arrayStyles.deleteButton}
                        />
                      </Box>
                    </Box>
                  ))}
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

export const objectFieldStyles: ObjectFieldStyles = {
  objectContainer: {
    spacing: 4,
    borderWidth: 1,
    borderColor: 'gray.200',
    padding: 2,
    borderRadius: 4,
    marginTop: 2,
    backgroundColor: 'gray.50',
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

export const ObjectField: FC<FieldProps<ObjectFieldSchema>> = ({
  name,
  field,
  id,
  defaultValue,
}) => {
  const {
    label,
    isCollapsable,
    isRequired,
    helperText,
    shouldDisplay,
    styles = {},
    divideAfter,
  } = field;

  const { watch } = useFormContext();

  const values = watch(name);

  const { isOpen, onToggle } = useDisclosure({
    isOpen: true,
  });

  const objectStyles = useStyles<ObjectFieldStyles>('objectField', styles);

  const errorMessage = useErrorMessage(name, field.label);

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
        isInvalid={Boolean(errorMessage)}
        {...objectStyles.control}
      >
        <Flex {...objectStyles.toolbar}>
          {Boolean(label) && (
            <FormLabel htmlFor={name} {...objectStyles.label}>
              {label}
            </FormLabel>
          )}
          {isCollapsable && (
            <IconButton
              icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
              aria-label={isOpen ? 'Hide items' : 'Show items'}
              onClick={onToggle}
              {...objectStyles.collapseButton}
            />
          )}
        </Flex>
        <Collapse in={isOpen} style={{ overflow: 'visible' }}>
          <Stack {...objectStyles.objectContainer}>
            {Object.entries(field.properties).map(
              ([fieldName, objectField], i) => {
                return (
                  <Box key={i} {...objectStyles.propertyContainer}>
                    {renderField(
                      [`${name}.${fieldName}`, objectField],
                      id,
                      defaultValue?.[fieldName]
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
