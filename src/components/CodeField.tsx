import React, { FC, useContext, useMemo, useEffect, useRef } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Divider,
  Flex,
  IconButton,
  Collapse,
  useDisclosure,
  useColorMode,
  useTheme,
  Button,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import Editor, { BeforeMount, OnMount } from '@monaco-editor/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import get from 'lodash.get';
import { isString } from 'lodash';
import LabelElement from './elements/Label';
import { FieldProps, CodeFieldSchema, FieldStyles } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';
import { registerSmsLanguageSupport } from './utils/smsLanguageSupport';

function getHeight({
  height,
  isCollapsible,
  isOpen,
  value,
}: {
  height?: string;
  isCollapsible?: boolean;
  isOpen?: boolean;
  value: any;
}) {
  if (!isCollapsible && !isOpen) {
    return 'auto';
  }

  if (!value) {
    return '200px';
  }
  if (height) {
    return height;
  }

  let lines = 0;

  if (isString(value)) {
    lines = value.split('\n').length;
  }

  if (Array.isArray(value)) {
    lines = value.length;
  }

  if (typeof value === 'object') {
    lines = JSON.stringify(value).split('\n').length;
  }

  const dynamicHeight = `${Math.max(lines * 10, 200)}px`;

  if (isCollapsible) {
    return isOpen ? dynamicHeight : 'auto';
  }

  return dynamicHeight;
}

export const CodeField: FC<FieldProps<CodeFieldSchema>> = ({
  name,
  field,
  index,
}) => {
  const {
    label,
    labelAddon,
    helperText,
    isRequired,
    shouldDisplay,
    styles = {},
    divideAfter,
    placeholder,
    disabled,
    readOnly,
    tooltip,
    isCollapsible,
    defaultIsOpen,
    height,
    language,
    beautifyButton = true,
    beautifyButtonText = 'Beautify',
  } = field;
  const editorRef = useRef<Parameters<OnMount>[0]>();

  const fieldStyles = useStyles<FieldStyles>('codeField', styles);
  const { colorMode } = useColorMode();

  const { isReadOnly } = useContext(Ctx);

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: !isCollapsible || defaultIsOpen,
  });

  const { control, setValue } = useFormContext();

  const errorMessage = useErrorMessage(name, label);

  const values = useWatch({
    control,
  });

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index) : true;
  }, [values, shouldDisplay]);

  useEffect(() => {
    const value = get(values, name);
    if (value && isString(value)) {
      setValue(name, value);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  const handleBeforeMount: BeforeMount = (monaco) => {
    if (language === 'sms') {
      registerSmsLanguageSupport({ monaco, colorMode });
    }
  };

  const handleEditorDidMount: OnMount = async (editor) => {
    editorRef.current = editor;

    // need to use the setTimeout because its possible that this finishes executing before the default value is set
    setTimeout(function() {
      editor.getAction('editor.action.formatDocument').run();
    }, 300);
  };

  const chakraTheme = useTheme();

  function getEditorTheme() {
    if (language === 'sms') {
      return 'sms-theme';
    }

    return colorMode === 'light' ? 'light' : 'vs-dark';
  }

  const editorTheme = getEditorTheme();

  return (
    <div style={{ position: 'relative' }}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, name } }) => {
          function getPlaceholder() {
            if (language === 'html' && value) {
              return value;
            }

            if (language === 'json' && value) {
              if (typeof value === 'string') {
                return value;
              }
              return JSON.stringify(value, null, 2);
            }

            if (language === 'go') {
              return value;
            }

            return placeholder;
          }

          return (
            <FormControl
              isRequired={isRequired}
              isInvalid={Boolean(errorMessage)}
              {...fieldStyles.control}
              isReadOnly={isReadOnly}
            >
              <Flex>
                <LabelElement
                  label={label}
                  labelAddon={labelAddon}
                  name={name}
                  fieldStyles={fieldStyles}
                  tooltip={tooltip}
                />
                <Box marginLeft="auto">
                  {beautifyButton && isOpen && (
                    <Tooltip label="Make your input well structured">
                      <Button
                        size={'xs'}
                        marginRight={isCollapsible ? '1' : undefined}
                        marginLeft="auto"
                        onClick={() =>
                          editorRef.current &&
                          editorRef.current
                            .getAction('editor.action.formatDocument')
                            .run()
                        }
                        {...fieldStyles.button}
                      >
                        {beautifyButtonText}
                      </Button>
                    </Tooltip>
                  )}
                  {isCollapsible && (
                    <IconButton
                      icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
                      aria-label={isOpen ? 'Hide items' : 'Show items'}
                      onClick={onToggle}
                      disabled={isReadOnly || disabled || readOnly}
                      size="xs"
                      {...fieldStyles.button}
                    />
                  )}
                </Box>
              </Flex>
              <Collapse
                in={isOpen}
                style={{
                  overflow: 'visible',
                }}
              >
                <Box borderWidth="1px" borderRadius="lg" padding={'5px'}>
                  <Editor
                    onMount={handleEditorDidMount}
                    beforeMount={handleBeforeMount}
                    defaultValue={getPlaceholder()}
                    theme={editorTheme}
                    height={getHeight({
                      height,
                      isCollapsible,
                      isOpen,
                      value,
                    })}
                    defaultLanguage={language}
                    options={{
                      lineHeight: 22,
                      contextmenu: false,
                      minimap: { enabled: false },
                      readOnly: isReadOnly || disabled || readOnly,
                      autoClosingBrackets: 'never',
                      autoClosingOvertype: 'always',
                      automaticLayout: true,
                      tabCompletion: 'on',
                      fixedOverflowWidgets: false,
                      fontSize: 16,
                      fontFamily: chakraTheme?.fonts?.body,
                      scrollBeyondLastLine: false,
                    }}
                    onChange={(value) => {
                      setValue(name, value);
                    }}
                  />
                </Box>
              </Collapse>
              {Boolean(helperText) && (
                <FormHelperText {...fieldStyles.helperText}>
                  {helperText}
                </FormHelperText>
              )}
              <FormErrorMessage {...fieldStyles.errorMessage}>
                {errorMessage}
              </FormErrorMessage>
            </FormControl>
          );
        }}
      />

      {divideAfter && <Divider mt="8" />}
    </div>
  );
};
