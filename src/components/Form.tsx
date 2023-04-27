import React, {
  BaseSyntheticEvent,
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
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
import {
  useForm,
  useWatch,
  FormProvider,
  UseFormProps,
  UseFormReturn,
  FieldValues,
} from 'react-hook-form';
import { isEmpty, merge, omit, cloneDeep } from 'lodash';
import {
  FormStyles,
  Field,
  Schema,
  SelectOptions,
  ArrayFieldSchema,
  ObjectFieldSchema,
} from '../types';
import { StyleCtx } from '../hooks/useStyles';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { CodeField } from './CodeField';
import { NumberField } from './NumberField';
import {
  ArrayField,
  arrayFieldStyles,
  ObjectField,
  objectFieldStyles,
} from './Containers';
import { DragDropField, dragDropFieldStyles } from './DragDropField';
import { SwitchField } from './SwitchField';
import { CheckboxField, checkboxFieldStyles } from './CheckboxField';
import { SelectField } from './SelectField';
import { Ctx } from './Ctx';
import DateField from './DateField';
import { ColorField } from './ColorField';
import FileField from './FileField';
import { HeadingField } from './HeadingField';
import { formatSelectInput, formatSelectOutput } from '../utils';
import { SecretField } from './SecretField';

type CustomButton = {
  render: (values: { [x: string]: any }) => ReactNode;
};

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
    customButtons?: CustomButton[];
  };
  formatSelectResults?: boolean;
  formatSelectDefaultValues?: boolean;
  debug?: boolean;
  resetOnSubmit?: boolean;
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
    button: {
      size: 'lg',
      backgroundColor: 'transparent',
      _hover: {
        backgroundColor: 'transparent',
      },
    },
  },
  arrayField: arrayFieldStyles,
  objectField: objectFieldStyles,
  checkboxField: checkboxFieldStyles,
  dragDropField: dragDropFieldStyles,
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

const renderForm = ({
  isReadOnly,
  selectOptions,
  baseStyles,
  form,
  formatSelectResults,
  handleSubmit,
  schema,
  title,
  helperText,
  buttons,
  values,
}: {
  isReadOnly?: boolean;
  selectOptions?: SelectOptions;
  baseStyles: FormStyles;
  form: UseFormReturn<FieldValues>;
  formatSelectResults?: boolean;
  handleSubmit: FormProps['handleSubmit'];
  schema: Schema;
  title?: string;
  helperText?: string;
  buttons?: FormProps['buttons'];
  values: any;
}) => {
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
            onSubmit={form.handleSubmit((values) => {
              const toOmit: string[] = [];
              Object.entries(values).forEach(([key, value]) => {
                if (schema[key]?.type === 'secret' && isEmpty(value)) {
                  toOmit.push(key);
                }
              });

              if (formatSelectResults) {
                return handleSubmit(
                  omit(formatSelectOutput({ values, schema }), toOmit)
                );
              }

              return handleSubmit(omit(values, toOmit));
            })}
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
                    <AccordionButton flex="0" {...baseStyles.form?.button}>
                      <IconButton
                        aria-label="show helper text"
                        icon={<QuestionIcon />}
                        {...baseStyles.form?.button}
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
              {buttons?.customButtons?.map(({ render }: CustomButton) =>
                render(values)
              )}
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
};

function formatDefaultValues(defaultValues: any, schema: Schema) {
  function replaceFalsyArrays(values: { [x: string]: any }, schema: Schema) {
    if (values && typeof values === 'object') {
      Object.entries(values).forEach(([key, value]) => {
        if (schema[key]?.type === 'array') {
          const arrayItemField = (schema[key] as ArrayFieldSchema).itemField;
          if (!value) {
            // Replace the falsy value with an empty array to prevent errors
            values[key] = [];
          } else if (arrayItemField.type === 'object') {
            // There may be more undefined arrays nested within this array of objects, recurse further
            values[key] = value.map((currValue: any) =>
              replaceFalsyArrays(currValue, arrayItemField.properties)
            );
          } else {
            // There are no more nested arrays in this path
            values[key] = value;
          }
        } else if (schema[key]?.type === 'object') {
          values[key] = replaceFalsyArrays(
            value,
            (schema[key] as ObjectFieldSchema).properties
          );
        } else {
          values[key] = value;
        }
      });
    }
    return values;
  }
  const initialClone = cloneDeep(defaultValues);
  //return cloneDeepWith(initialClone, omitFn);
  return replaceFalsyArrays(initialClone, schema);
}

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
  formatSelectResults = false,
  formatSelectDefaultValues = false,
  debug = false,
}: FormProps) {
  const getOptions = useCallback(() => {
    if (!formOptions) {
      return {};
    }

    if (formOptions.defaultValues) {
      const formattedDefaultValues = formatDefaultValues(
        formOptions.defaultValues,
        schema
      );

      if (formatSelectDefaultValues) {
        return {
          ...formOptions,
          defaultValues: formatSelectInput({
            selectOptions: selectOptions || {},
            defaultValues: formattedDefaultValues,
            schema,
          }),
        };
      }
      return { ...formOptions, defaultValues: formattedDefaultValues };
    }

    return formOptions;
  }, [formOptions, formatSelectDefaultValues]);

  const form = useForm(getOptions());

  if (debug) {
    console.table(form.formState.errors);
  }

  const values = useWatch({ control: form.control });

  const baseStyles = useMemo(() => {
    return overwriteDefaultStyles ? styles : merge(defaultStyles, styles);
  }, [styles, overwriteDefaultStyles]);

  return renderForm({
    isReadOnly,
    selectOptions,
    baseStyles,
    form,
    formatSelectResults,
    handleSubmit,
    schema,
    title,
    helperText,
    buttons,
    values,
  });
}

export function useFormMethods<T = Record<string, any>>({
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
  formatSelectResults = false,
  formatSelectDefaultValues = false,
  debug = false,
  resetOnSubmit = false,
}: FormProps) {
  const getOptions = useCallback(() => {
    if (!formOptions) {
      return {};
    }

    if (formOptions.defaultValues && formatSelectDefaultValues) {
      return {
        ...formOptions,
        defaultValues: formatSelectInput({
          selectOptions: selectOptions || {},
          defaultValues: formOptions.defaultValues,
          schema,
        }),
      };
    }

    return formOptions;
  }, [formOptions, formatSelectDefaultValues]);

  const form = useForm(getOptions());

  const values = useWatch({ control: form.control }) as T;

  if (debug) {
    console.table(values);
    console.table(form.formState.errors);
  }

  const baseStyles = useMemo(() => {
    return overwriteDefaultStyles ? styles : merge(defaultStyles, styles);
  }, [styles, overwriteDefaultStyles]);

  const handleSubmitOverride = resetOnSubmit
    ? (values: T) => {
        form.reset();
        return handleSubmit(values);
      }
    : handleSubmit;

  return {
    formMethods: form,
    renderForm: renderForm({
      isReadOnly,
      selectOptions,
      baseStyles,
      form,
      formatSelectResults,
      handleSubmit: handleSubmitOverride,
      schema,
      title,
      helperText,
      buttons,
      values,
    }),
  };
}
