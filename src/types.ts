import { FC } from 'react';
import {
  FormControlProps,
  InputProps,
  BoxProps,
  HeadingProps,
  ButtonGroupProps,
  ButtonProps,
  InputAddonProps,
  IconButtonProps,
  StackProps,
  FlexProps,
  Pseudos,
  SwitchProps,
  CheckboxProps,
  SelectProps,
  InputGroupProps,
  FormLabelProps,
} from '@chakra-ui/react';
import { FormPropsGeneric } from 'components/Form';

export type Schema = Record<string, Field>;

export type Field =
  | TextFieldSchema
  | TextAreaFieldSchema
  | NumberFieldSchema
  | ArrayFieldSchema
  | ObjectFieldSchema
  | SwitchFieldSchema
  | CheckboxFieldSchema
  | SelectFieldSchema
  | SelectFieldOptionsFromContextSchema
  | CustomFieldSchema
  | JsonFieldSchema;

export interface FieldProps<T extends FieldSchema> {
  id?: string;
  name: string;
  field: T;
  defaultValue?: any;
}

interface FieldSchema {
  type:
    | 'text'
    | 'textArea'
    | 'number'
    | 'switch'
    | 'array'
    | 'object'
    | 'checkbox'
    | 'select'
    | 'select-options-from-context'
    | 'json'
    | 'custom';
  styles?:
    | FieldStyles
    | ArrayFieldStyles
    | ObjectFieldStyles
    | CheckboxFieldStyles
    | SelectFieldStyles;
  shouldDisplay?: (values?: any) => boolean;
}

export interface CustomFieldSchema extends Pick<FieldSchema, 'type'> {
  type: 'custom';
  component: FC<Record<string, any>>;
  props?: Record<string, any>;
}

interface FormController {
  label?: string;
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
  defaultValue?: any;
  tooltip?: string;
  divideAfter?: boolean;
}

export interface TextFieldSchema extends FieldSchema, FormController {
  type: 'text';
  htmlInputType?: string;
  leftInputAddon?: InputAddonProps;
  rightInputAddon?: InputAddonProps;
}

export interface TextAreaFieldSchema extends FieldSchema, FormController {
  type: 'textArea';
}
export interface JsonFieldSchema extends FieldSchema, FormController {
  type: 'json';
}

export interface NumberFieldSchema extends FieldSchema, FormController {
  type: 'number';
}

export interface ArrayFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'label' | 'helperText' | 'isRequired' | 'divideAfter'
    > {
  type: 'array';
  isCollapsable?: boolean;
  itemField: Field;
}

export interface ObjectFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'label' | 'helperText' | 'isRequired' | 'divideAfter'
    > {
  type: 'object';
  isCollapsable?: boolean;
  properties: Record<string, Field>;
}

export interface SwitchFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'helperText'
      | 'isRequired'
      | 'defaultValue'
      | 'tooltip'
      | 'divideAfter'
    > {
  type: 'switch';
}

export interface CheckboxFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'label' | 'helperText' | 'isRequired' | 'divideAfter'
    > {
  type: 'checkbox';
  checkboxes: {
    name: string;
    label?: string;
  }[];
}

export interface SelectFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'label' | 'helperText' | 'isRequired' | 'defaultValue' | 'divideAfter'
    > {
  type: 'select';
  options: {
    label?: string;
    value: string;
  }[];
}

export interface SelectFieldOptionsFromContextSchema<
  T extends FormPropsGeneric = any
>
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'helperText'
      | 'isRequired'
      | 'placeholder'
      | 'defaultValue'
      | 'divideAfter'
    > {
  type: 'select-options-from-context';
  optionsKey: keyof T;
}

export interface FormStyles {
  form?: {
    container?: BoxProps;
    title?: HeadingProps;
    fieldSpacing?: number;
    buttonGroup?: ButtonGroupProps;
    submitButton?: Omit<ButtonProps, 'children' | 'type'>;
    resetButton?: Omit<ButtonProps, 'children' | 'type'>;
  };

  textField?: FieldStyles;
  textAreaField?: FieldStyles;
  json?: FieldStyles;
  numberField?: FieldStyles;
  arrayField?: ArrayFieldStyles;
  objectField?: ObjectFieldStyles;
  switchField?: SwitchFieldStyles;
  checkboxField?: CheckboxFieldStyles;
  selectField?: SelectFieldStyles;
}

export interface FieldStyles {
  control?: FormControlProps;
  label?: Omit<FormLabelProps, 'children'>;
  input?: InputProps;
  helperText?: BoxProps;
  errorMessage?: BoxProps;
  inputGroup?: Omit<InputGroupProps, 'children'>;
}

export interface ArrayFieldStyles
  extends Pick<
      FieldStyles,
      'control' | 'label' | 'helperText' | 'errorMessage'
    >,
    CollapsableStyles {
  arrayContainer?: StackProps;
  itemContainer?: BoxProps;
  buttonGroup?: ButtonGroupProps;
  addButton?: Partial<IconButtonProps>;
  deleteButton?: Partial<IconButtonProps>;
  clearButton?: Partial<IconButtonProps>;
  deleteItemContainer?: BoxProps;
  countText?: Pseudos;
}

export interface ObjectFieldStyles
  extends Pick<
      FieldStyles,
      'control' | 'label' | 'helperText' | 'errorMessage'
    >,
    CollapsableStyles {
  objectContainer?: StackProps;
  propertyContainer?: BoxProps;
}

export interface CollapsableStyles {
  toolbar?: FlexProps;
  collapseButton?: Partial<IconButtonProps>;
}

export interface SwitchFieldStyles
  extends Pick<
    FieldStyles,
    'control' | 'label' | 'helperText' | 'errorMessage'
  > {
  switch?: SwitchProps;
}

export interface CheckboxFieldStyles
  extends Pick<
    FieldStyles,
    'control' | 'label' | 'helperText' | 'errorMessage'
  > {
  checkboxGroup?: StackProps;
  checkbox?: CheckboxProps;
}

export interface SelectFieldStyles
  extends Pick<
    FieldStyles,
    'control' | 'label' | 'helperText' | 'errorMessage'
  > {
  select?: SelectProps;
}
