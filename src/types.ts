import { FC, ReactNode } from 'react';
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
  InputGroupProps,
  FormLabelProps,
  HelpTextProps,
} from '@chakra-ui/react';
import {
  OptionsOrGroups,
  Props as ChakraReactSelectProps,
} from 'chakra-react-select';
import { ReactDatePickerProps } from 'react-datepicker';
import { FileError, Accept } from 'react-dropzone';

export type SelectOptions = Record<
  string,
  {
    isLoading: boolean;
    options: SelectFieldSchema['options'];
  }
>;

export type Schema = Record<string, Field>;

export type Field =
  | TextFieldSchema
  | TextAreaFieldSchema
  | NumberFieldSchema
  | ArrayFieldSchema
  | ObjectFieldSchema
  | DragDropFieldSchema
  | SwitchFieldSchema
  | CheckboxFieldSchema
  | SelectFieldSchema
  | CustomFieldSchema
  | JsonFieldSchema
  | DateFieldSchema
  | ColorFieldSchema
  | FileFieldSchema
  | HeadingFieldSchema;

export interface FieldProps<T extends FieldSchema> {
  id?: string;
  name: string;
  field: T;
  defaultValue?: any;
  index?: number;
}

interface FieldSchema {
  type:
    | 'text'
    | 'textArea'
    | 'number'
    | 'switch'
    | 'array'
    | 'object'
    | 'dragDrop'
    | 'checkbox'
    | 'select'
    | 'json'
    | 'date'
    | 'color'
    | 'file'
    | 'heading'
    | 'custom';
  styles?:
    | FieldStyles
    | ArrayFieldStyles
    | ObjectFieldStyles
    | CheckboxFieldStyles
    | SelectFieldStyles;
  shouldDisplay?: (values?: any, index?: number | null) => boolean;
  disabled?: true;
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
  renderAfter?: (values: any) => ReactNode;
}

export interface TextAreaFieldSchema extends FieldSchema, FormController {
  type: 'textArea';
}
export interface JsonFieldSchema extends FieldSchema, FormController {
  type: 'json';
  stringify?: boolean;
  isCollapsable?: boolean;
  defaultIsOpen?: boolean;
}

export interface NumberFieldSchema extends FieldSchema, FormController {
  type: 'number';
  min?: number;
  max?: number;
  format?: (val: number) => string;
  parse?: (val: string) => number;
  step?: number;
  precision?: number;
}

export interface ArrayFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'label' | 'helperText' | 'isRequired' | 'divideAfter' | 'tooltip'
    > {
  type: 'array';
  isCollapsable?: boolean;
  defaultIsOpen?: boolean;
  hideCount?: boolean;
  draggable?: boolean;
  itemField: Field;
}

export interface ObjectFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'label' | 'helperText' | 'isRequired' | 'divideAfter' | 'tooltip'
    > {
  type: 'object';
  isCollapsable?: boolean;
  properties: Record<string, Field>;
}

export interface DragDropFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'label' | 'helperText' | 'isRequired' | 'divideAfter' | 'tooltip'
    > {
  type: 'dragDrop';
  optionField: Field;
  optionToString: (values: { [x: string]: any }) => string;
  options: { [x: string]: any }[];
  dragText?: string;
  noOptionsText?: string;
  maxSelectedContainerHeight?: string;
  maxUnselectedContainerHeight?: string;
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

export interface DateFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'label' | 'helperText' | 'isRequired' | 'divideAfter' | 'placeholder'
    > {
  type: 'date';
  defaultValue?: Date;
  format?: string;
  isClearable?: boolean;
  showTime?: boolean;
  timeOnly?: boolean;
  timeInterval?: number;
  pickerProps?: ReactDatePickerProps;
}

export interface ColorFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'helperText'
      | 'isRequired'
      | 'divideAfter'
      | 'placeholder'
      | 'tooltip'
    > {
  type: 'color';
  defaultValue?: string;
}

export interface FileFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'helperText'
      | 'isRequired'
      | 'divideAfter'
      | 'placeholder'
      | 'tooltip'
    > {
  type: 'file';
  defaultValue?: string;
  validator?: (file: File) => FileError | FileError[] | null;
  accept?: Accept;
  maxFiles?: number;
  showPreview?: boolean;
  uploadHeading?: string;
  uploadSubheading?: string;
  onDrop?: (files: File[]) => Promise<void>;
  isLoading?: boolean;
  enableUrlInput?: boolean;
  fileToUrl?: (file: File) => string;
}

export interface HeadingFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      'helperText' | 'divideAfter' | 'placeholder' | 'tooltip'
    > {
  type: 'heading';
  size?: string;
}

type SelectProps = Pick<
  ChakraReactSelectProps,
  | 'isClearable'
  | 'isMulti'
  | 'isSearchable'
  | 'hasStickyGroupHeaders'
  | 'formatOptionLabel'
>;
export interface SelectFieldSchemaWithOptions
  extends FieldSchema,
    SelectProps,
    Pick<
      FormController,
      | 'label'
      | 'helperText'
      | 'isRequired'
      | 'defaultValue'
      | 'divideAfter'
      | 'placeholder'
      | 'tooltip'
    > {
  type: 'select';
  options?: OptionsOrGroups<string | number, any> | undefined;
}
export interface SelectFieldSchemaWithOptions
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'helperText'
      | 'isRequired'
      | 'defaultValue'
      | 'divideAfter'
      | 'placeholder'
      | 'tooltip'
    > {
  type: 'select';
  selectKey?: keyof SelectOptions;
  isMulti?: boolean;
}

export type SelectFieldSchema = SelectFieldSchemaWithOptions;

export interface FormStyles {
  form?: {
    container?: BoxProps;
    title?: HeadingProps;
    helperText?: HelpTextProps;
    fieldSpacing?: number;
    buttonGroup?: ButtonGroupProps;
    submitButton?: Omit<ButtonProps, 'children' | 'type'>;
    resetButton?: Omit<ButtonProps, 'children' | 'type'>;
  };

  textField?: FieldStyles;
  textAreaField?: FieldStyles;
  json?: FieldStyles;
  numberField?: FieldStyles;
  fileField?: FieldStyles;
  jsonField?: FieldStyles;
  arrayField?: ArrayFieldStyles;
  objectField?: ObjectFieldStyles;
  dragDropField?: DragDropFieldStyles;
  switchField?: SwitchFieldStyles;
  checkboxField?: CheckboxFieldStyles;
  selectField?: SelectFieldStyles;
  headingField?: FieldStyles;
}

export interface FieldStyles {
  control?: FormControlProps;
  label?: Omit<FormLabelProps, 'children'>;
  input?: InputProps;
  helperText?: BoxProps;
  errorMessage?: BoxProps;
  inputGroup?: Omit<InputGroupProps, 'children'>;
  button?: Omit<ButtonProps, 'children' | 'type'>;
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
  dragButton?: Partial<IconButtonProps>;
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

export interface DragDropFieldStyles
  extends Pick<
    FieldStyles,
    'control' | 'label' | 'helperText' | 'errorMessage'
  > {
  arrayContainer?: StackProps;
  itemContainer?: BoxProps;
  selectedContainer?: BoxProps;
  unselectedContainer?: BoxProps;
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
