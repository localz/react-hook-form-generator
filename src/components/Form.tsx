import React, { BaseSyntheticEvent, createContext, useMemo } from 'react';
import { Box, Heading, Stack, ButtonGroup, Button } from '@chakra-ui/react';
import { useForm, FormProvider, UseFormProps } from 'react-hook-form';
import merge from 'lodash.merge';
import set from 'lodash.set';

import { FormStyles, Field, Schema } from '../types';
import { StyleCtx } from '../hooks/useStyles';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
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
import { SelectFieldContextOptions } from './SelectFieldContextOptions';

export interface FormPropsGeneric {
  ctx?: {
    actionOptions: Array<{ value: string; label: string }>;
  };
}

export interface FormProps<T extends FormPropsGeneric = any> {
  isReadOnly?: boolean;
  title?: string;
  schema: Schema;
  reactContext?: React.Context<T['ctx']>;
  handleSubmit: (values: any, e?: BaseSyntheticEvent) => void;
  styles?: FormStyles;
  overwriteDefaultStyles?: boolean;
  formOptions?: UseFormProps;
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
        <Box key={`${name}-container`}>
          <Component name={name} field={field} {...field.props} />
        </Box>
      );

    default:
      break;
  }

  return (
    <Box key={`${name}-container`}>
      <Component name={name} field={field} />
    </Box>
  );
};

export const Ctx = createContext<{ isReadOnly: boolean }>({
  isReadOnly: false,
});

export function Form<T extends FormPropsGeneric = any>({
  title,
  schema,
  handleSubmit,
  formOptions,
  overwriteDefaultStyles,
  buttons,
  styles = {},
  reactContext,
  isReadOnly,
}: FormProps<T>) {
  const form = useForm(formOptions);

  if (reactContext) {
    /*
     * This is yucky but putting context inside another provider would be even more yucky
     */
    set(form, 'reactContext', reactContext);
  }

  const baseStyles = useMemo(() => {
    return overwriteDefaultStyles ? styles : merge(defaultStyles, styles);
  }, [styles, overwriteDefaultStyles]);

  return (
    <Ctx.Provider
      value={{
        isReadOnly: Boolean(isReadOnly),
      }}
    >
      <StyleCtx.Provider value={baseStyles}>
        <FormProvider {...form}>
          <Box
            as="form"
            onSubmit={form.handleSubmit(handleSubmit)}
            {...baseStyles.form?.container}
          >
            {title && <Heading {...baseStyles.form?.title}>{title}</Heading>}
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
