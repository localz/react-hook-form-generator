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
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { FieldValues, UseFormReset, UseFormSetValue } from 'react-hook-form';

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
  | CodeFieldSchema
  | DateFieldSchema
  | ColorFieldSchema
  | FileFieldSchema
  | HeadingFieldSchema
  | SecretFieldSchema;

export interface FieldProps<T extends FieldSchema> {
  id?: string;
  name: string;
  field: T;
  defaultValue?: any;
  index?: number;
  nestedIndex?: number[];
}

export interface FieldSchema {
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
    | 'code'
    | 'date'
    | 'color'
    | 'file'
    | 'heading'
    | 'secret'
    | 'custom';
  styles?:
    | FieldStyles
    | ArrayFieldStyles
    | ObjectFieldStyles
    | CheckboxFieldStyles
    | SelectFieldStyles;
  shouldDisplay?: (
    values?: any,
    index?: number | null,
    nestedIndex?: number[]
  ) => boolean | undefined;
  deriveValue?: (
    values?: any,
    index?: number | null,
    nestedIndex?: number[]
  ) => any;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface CustomFieldSchema extends Pick<FieldSchema, 'type'> {
  type: 'custom';
  component: FC<Record<string, any>>;
  props?: Record<string, any>;
}

interface FormController {
  label?: string;
  labelAddon?: ReactNode;
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
  defaultValue?: any;
  tooltip?: string;
  divideAfter?: boolean;
  beautifyButton?: boolean;
  beautifyButtonText?: string;
}

export interface TextFieldSchema extends FieldSchema, FormController {
  type: 'text';
  htmlInputType?: string;
  leftInputAddon?: InputAddonProps;
  rightInputAddon?: InputAddonProps;
  renderAfter?: (values: any) => ReactNode;
  copyToClipboard?: boolean;
  onCopy?: () => void;
  onCopyError?: () => void;
  inputValidation?: {
    validator: (value: string) => Promise<boolean>;
    loading: boolean;
    timeout?: number;
    validationError?: string;
  };
  variant?: InputProps['variant'];
}

export interface TextAreaFieldSchema extends FieldSchema, FormController {
  type: 'textArea';
  autoResize?: boolean;
}

export type CodeLanguage = 'json' | 'html' | 'go' | 'sms';

export interface CodeFieldSchema extends FieldSchema, FormController {
  type: 'code';
  language: CodeLanguage;
  isCollapsible?: boolean;
  defaultIsOpen?: boolean;
  height?: string;
  editorProps?: editor.IStandaloneEditorConstructionOptions;
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
      | 'label'
      | 'labelAddon'
      | 'labelAddon'
      | 'helperText'
      | 'isRequired'
      | 'divideAfter'
      | 'tooltip'
    > {
  type: 'array';
  isCollapsible?: boolean;
  defaultIsOpen?: boolean;
  hideCount?: boolean;
  draggable?: boolean;
  disableButtons?: boolean;
  itemField: Field;
}

export interface ObjectFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'labelAddon'
      | 'helperText'
      | 'isRequired'
      | 'divideAfter'
      | 'tooltip'
    > {
  type: 'object';
  isCollapsible?: boolean;
  properties: Record<string, Field>;
}

export interface DragDropFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'labelAddon'
      | 'helperText'
      | 'isRequired'
      | 'divideAfter'
      | 'tooltip'
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
      | 'labelAddon'
      | 'helperText'
      | 'isRequired'
      | 'defaultValue'
      | 'tooltip'
      | 'divideAfter'
    > {
  type: 'switch';
  onEnable?: (
    setValue: UseFormSetValue<FieldValues>,
    reset: UseFormReset<FieldValues>,
    values: any
  ) => void;
  onDisable?: (
    setValue: UseFormSetValue<FieldValues>,
    reset: UseFormReset<FieldValues>,
    values: any
  ) => void;
}

export interface CheckboxFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'labelAddon'
      | 'helperText'
      | 'tooltip'
      | 'isRequired'
      | 'divideAfter'
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
      | 'label'
      | 'labelAddon'
      | 'helperText'
      | 'tooltip'
      | 'isRequired'
      | 'divideAfter'
      | 'placeholder'
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
      | 'labelAddon'
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
      | 'labelAddon'
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
  copyToClipboard?: boolean;
  onCopy?: () => void;
  onCopyError?: () => void;
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
      | 'labelAddon'
      | 'helperText'
      | 'isRequired'
      | 'defaultValue'
      | 'divideAfter'
      | 'placeholder'
      | 'tooltip'
    > {
  type: 'select';
  options?: OptionsOrGroups<string | number, any> | undefined;
  generateOptions?: (
    values: any,
    index?: number | null,
    nestedIndex?: number[]
  ) => OptionsOrGroups<string | number, any> | undefined;
}
export interface SelectFieldSchemaWithOptions
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'labelAddon'
      | 'helperText'
      | 'isRequired'
      | 'defaultValue'
      | 'divideAfter'
      | 'placeholder'
      | 'tooltip'
    > {
  type: 'select';
  selectKey?: keyof SelectOptions;
  renderAfter?: (values: any) => ReactNode;
  isMulti?: boolean;
}

export type SelectFieldSchema = SelectFieldSchemaWithOptions;

export interface SecretFieldSchema
  extends FieldSchema,
    Pick<
      FormController,
      | 'label'
      | 'labelAddon'
      | 'helperText'
      | 'divideAfter'
      | 'isRequired'
      | 'placeholder'
      | 'tooltip'
      | 'defaultValue'
    > {
  type: 'secret';
  clearOriginalValue?: boolean;
  copyToClipboard?: boolean;
  onCopy?: () => void;
  onCopyError?: () => void;
  toggleIcon?: 'lock' | 'eye';
}

export interface FormStyles {
  form?: {
    container?: BoxProps;
    title?: HeadingProps;
    helperText?: HelpTextProps;
    fieldSpacing?: number;
    buttonGroup?: ButtonGroupProps;
    submitButton?: Omit<ButtonProps, 'children' | 'type'>;
    resetButton?: Omit<ButtonProps, 'children' | 'type'>;
    button?: Omit<ButtonProps, 'children' | 'type'>;
  };

  textField?: FieldStyles;
  textAreaField?: FieldStyles;
  code?: FieldStyles;
  numberField?: FieldStyles;
  fileField?: FieldStyles;
  codeField?: FieldStyles;
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
