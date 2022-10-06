import React, { BaseSyntheticEvent, Fragment, useMemo } from 'react';
import {
  Box,
  Heading,
  Stack,
  ButtonGroup,
  Button,
  Text,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Flex,
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useForm, FormProvider, UseFormProps } from 'react-hook-form';
import merge from 'lodash.merge';
import { FormStyles, Field, Schema, SelectOptions } from '../types';
import { StyleCtx } from '../hooks/useStyles';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { JsonField } from './JsonField';
import { NumberField } from './NumberField';
import {
  ArrayField,
  arrayFieldStyles,
  ObjectField,
  objectFieldStyles,
} from './Containers';
import { SwitchField } from './SwitchField';
import { CheckboxField, checkboxFieldStyles } from './CheckboxField';
import { SelectField } from './SelectField';
import { Ctx } from './Ctx';
import DateField from './DateField';
import { ColorField } from './ColorField';
import FileField from './FileField';

export interface FormProps {
  isReadOnly?: boolean;
  title?: string;
  helperText?: string;
  schema: Schema;
  handleSubmit: (values: any, e?: BaseSyntheticEvent) => void;
  styles?: FormStyles;
  overwriteDefaultStyles?: boolean;
  formOptions?: UseFormProps;
  selectOptions?: SelectOptions;
  buttons?: {
    reset?: {
      text?: string;
      show?: boolean;
    };
    submit?: {
      text?: string;
    };
  };
}

const defaultStyles: FormStyles = {
  form: {
    container: {
      padding: 4,
    },
    title: {
      size: 'lg',
      marginBottom: 4,
    },
    fieldSpacing: 6,
    buttonGroup: {
      marginTop: 4,
    },
    submitButton: {
      size: 'sm',
    },
    resetButton: {
      size: 'sm',
    },
  },
  arrayField: arrayFieldStyles,
  objectField: objectFieldStyles,
  checkboxField: checkboxFieldStyles,
};

const renderField = ([name, field]: [string, Field]) => {
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

    case 'file':
      Component = FileField;
      break;

    case 'custom':
      Component = field.component;
      return (
        <Fragment key={`${name}-container`}>
          <Component name={name} field={field} {...field.props} />
        </Fragment>
      );

    default:
      break;
  }

  return (
    <Fragment key={`${name}-container`}>
      <Component name={name} field={field} />
    </Fragment>
  );
};

export function Form({
  title,
  helperText,
  schema,
  handleSubmit,
  formOptions,
  overwriteDefaultStyles,
  buttons,
  styles = {},
  isReadOnly,
  selectOptions,
}: FormProps) {
  const form = useForm(formOptions);

  const baseStyles = useMemo(() => {
    return overwriteDefaultStyles ? styles : merge(defaultStyles, styles);
  }, [styles, overwriteDefaultStyles]);

  return (
    <Ctx.Provider
      value={{
        isReadOnly: Boolean(isReadOnly),
        selectOptions: selectOptions || {},
      }}
    >
      <StyleCtx.Provider value={baseStyles}>
        <FormProvider {...form}>
          <Box
            as="form"
            onSubmit={form.handleSubmit(handleSubmit)}
            {...baseStyles.form?.container}
          >
            {title && !helperText && (
              <Heading {...baseStyles.form?.title}>{title}</Heading>
            )}

            {title && helperText && (
              <Accordion allowMultiple border="none" mb="4">
                <AccordionItem border="none">
                  <Flex alignItems="center">
                    <Heading flex="1" {...baseStyles.form?.title}>
                      {title}
                    </Heading>
                    <AccordionButton
                      flex="0"
                      backgroundColor="transparent"
                      _hover={{
                        backgroundColor: 'transparent',
                      }}
                    >
                      <IconButton
                        backgroundColor="transparent"
                        _hover={{
                          backgroundColor: 'transparent',
                        }}
                        aria-label="show helper text"
                        icon={<QuestionIcon />}
                      />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel padding="0">
                    <Text {...baseStyles.form?.helperText}>{helperText}</Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}

            <Stack spacing={baseStyles.form?.fieldSpacing}>
              {Object.entries(schema).map(renderField)}
            </Stack>

            <ButtonGroup
              w="100%"
              display="flex"
              justifyContent="flex-end"
              {...baseStyles.form?.buttonGroup}
            >
              {buttons?.reset?.show && (
                <Button type="reset" {...baseStyles.form?.resetButton}>
                  {buttons?.reset?.text || 'Reset'}
                </Button>
              )}

              {!isReadOnly && (
                <Button
                  size="lg"
                  variant="solid"
                  type="submit"
                  {...baseStyles.form?.submitButton}
                >
                  {buttons?.submit?.text || 'Submit'}
                </Button>
              )}
            </ButtonGroup>
          </Box>
        </FormProvider>
      </StyleCtx.Provider>
    </Ctx.Provider>
  );
}
