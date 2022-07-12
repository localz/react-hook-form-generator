import React, { FC, useMemo } from 'react';
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
import { AddIcon, DeleteIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useFormContext, useFieldArray } from 'react-hook-form';

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
import { SelectFieldContextOptions } from './SelectFieldContextOptions';
import { TextAreaField } from './TextAreaField';

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

    case 'select-options-from-context':
      Component = SelectFieldContextOptions;
      break;

    case 'custom':
      Component = field.component;
      return (
        <Box>
          <Component
            id={id}
            data-testid={id}
            name={name}
            field={field}
            defaultValue={defaultValue}
            {...field.props}
          />
        </Box>
      );

    default:
      break;
  }

  return (
    <Box>
      <Component
        id={id}
        data-testid={id}
        name={name}
        field={field}
        defaultValue={defaultValue}
      />
    </Box>
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

export const ArrayField: FC<FieldProps<ArrayFieldSchema>> = ({
  name,
  field,
}) => {
  const {
    label,
    isRequired,
    isCollapsable,
    itemField,
    helperText,
    shouldDisplay,
    styles = {},
    divideAfter,
  } = field;

  const { control, watch } = useFormContext();

  const values = watch(name);

  const { fields, append, remove } = useFieldArray({ name, control });

  const { isOpen, onOpen, onToggle } = useDisclosure();

  const arrayStyles = useStyles<ArrayFieldStyles>('arrayField', styles);

  const errorMessage = useErrorMessage(name, label);

  const addItem = () => {
    append({});
    onOpen();
  };

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
        {...arrayStyles.control}
      >
        <Flex {...arrayStyles.toolbar}>
          {Boolean(label) && (
            <FormLabel htmlFor={name} {...arrayStyles.label}>
              {label}
              <Box>({fields.length})</Box>
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

        <Collapse in={isOpen}>
          <Stack {...arrayStyles.arrayContainer}>
            {fields.map((item, i) => (
              <Box
                key={item?.id || `${name}[${i}].value`}
                {...arrayStyles.itemContainer}
              >
                {renderField(
                  [`${name}[${i}].value`, itemField],
                  item.id,
                  // @ts-ignore
                  item.value
                )}
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
        <Collapse in={isOpen}>
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
