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
import Editor, { OnMount } from '@monaco-editor/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import get from 'lodash.get';
import { isString } from 'lodash';

import LabelElement from './elements/Label';
import { FieldProps, CodeFieldSchema, FieldStyles } from '../types';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

export const CodeField: FC<FieldProps<CodeFieldSchema>> = ({
  name,
  field,
  index,
}) => {
  const {
    label,
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
  const colorMode = useColorMode();

  const theme = useTheme();

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

  const handleEditorDidMount: OnMount = async (editor, _) => {
    editorRef.current = editor;

    // need to use the setTimeout because its possible that this finishes executing before the default value is set
    setTimeout(function() {
      editor.getAction('editor.action.formatDocument').run();
    }, 300);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, name } }) => {
          const getPlaceholder = () => {
            if (language === 'html' && value) {
              return value;
            } else if (language === 'json' && value) {
              if (typeof value === 'string') {
                return value;
              }
              return JSON.stringify(value, null, 2);
            }

            return placeholder;
          };

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
                    defaultValue={getPlaceholder()}
                    theme={
                      colorMode.colorMode === 'light' ? 'light' : 'vs-dark'
                    }
                    height={height ?? '200px'}
                    defaultLanguage={language}
                    options={{
                      contextmenu: false,
                      minimap: { enabled: false },
                      readOnly: isReadOnly || disabled || readOnly,
                      autoClosingBrackets: 'always',
                      autoClosingOvertype: 'always',
                      automaticLayout: true,
                      tabCompletion: 'on',
                      fontSize: 16,
                      fontFamily: theme?.fonts?.body,
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
