import React, { FC, useContext, useMemo, useEffect, useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Divider,
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  List,
  ListItem,
  ListIcon,
  Icon,
  Image,
  Input,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  useFormContext,
  useWatch,
  UseFormSetValue,
  FieldValues,
} from 'react-hook-form';
import { useDropzone, FileRejection, FileError, Accept } from 'react-dropzone';
import { round, isEmpty } from 'lodash';
import { FieldProps, FileFieldSchema, FieldStyles } from '../types';
import FileUploadIcon from './elements/FileUploadIcon';
import LabelElement from './elements/Label';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useStyles } from '../hooks/useStyles';
import { Ctx } from './Ctx';

const SelectedFile = ({
  file,
  url,
  onRemove,
  isLoading,
  showPreview,
  fieldStyles,
}: {
  file?: File;
  url: string;
  onRemove: () => void;
  isLoading?: boolean;
  showPreview?: boolean;
  fieldStyles: FieldStyles;
}) => {
  return (
    <Flex flexDirection="row" alignItems="center" margin={2} columnGap={2}>
      {showPreview && (
        <Box
          boxSizing="border-box"
          display="inline-flex"
          borderRadius={2}
          border="1px solid #EAEAEA"
          width={100}
          height={100}
          justifyContent="center"
          alignItems="center"
          padding={1}
        >
          {isLoading ? (
            <Spinner size="xl" color="orange" />
          ) : (
            <Flex minWidth={0} overflow="hidden">
              <Image
                display="block"
                objectFit="contain"
                width="auto"
                height="100%"
                src={url}
                onLoad={() => {
                  URL.revokeObjectURL(url);
                }}
                fallback={<Text>Invalid URL or image is unavailable</Text>}
              />
            </Flex>
          )}
        </Box>
      )}
      {file && (
        <Text>
          {file.name} - {round(file.size / (1024 * 1024), 2)} MB
        </Text>
      )}
      {isLoading && <Spinner size="xs" color="orange" marginRight={2} />}
      {!isLoading && <Icon as={CheckCircleIcon} color="green.500" />}
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Clear items"
        onClick={(event: any) => {
          event.stopPropagation();
          onRemove();
        }}
        size="xs"
        marginLeft="auto"
        {...fieldStyles.button}
      />
    </Flex>
  );
};

type FileUploadProps = {
  name: string;
  setValue: UseFormSetValue<FieldValues>;
  fieldStyles: FieldStyles;
  uploadHeading?: string;
  uploadSubheading?: string;
  showPreview?: boolean;
  imageUrl?: string;
  isLoading?: boolean;
  onDrop?: (files: File[]) => void;
  disabled?: boolean;
  fileToUrl?: (file: File) => string;
  validator?: (file: File) => FileError | FileError[] | null;
  accept?: Accept;
  maxFiles?: number;
};

const FileUpload = ({
  name,
  setValue,
  fieldStyles,
  uploadHeading,
  uploadSubheading,
  showPreview,
  imageUrl,
  isLoading,
  onDrop,
  disabled,
  fileToUrl,
  validator,
  accept,
  maxFiles = 1,
}: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const uploaded = !isEmpty(selectedFiles);
  const [fileString, setFileString] = useState('');

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept,
    maxFiles,
    validator,
    onDrop,
    disabled: disabled,
  });

  useEffect(() => {
    if (!isEmpty(acceptedFiles)) setSelectedFiles(acceptedFiles);
  }, [acceptedFiles]);

  useEffect(() => {
    if (uploaded && !isLoading) {
      const joinedFileString = fileToUrl
        ? selectedFiles.map(fileToUrl).join()
        : selectedFiles.toString();

      setFileString(joinedFileString);
      setValue(name, joinedFileString);
    }
  }, [selectedFiles, isLoading]);

  useEffect(() => {
    if (uploaded && fileToUrl && imageUrl !== fileString) {
      setSelectedFiles([]);
    }
  }, [imageUrl]);

  const errors = fileRejections.map(({ file, errors }: FileRejection) => (
    <ListItem key={file.name}>
      {errors.map((e, i) => (
        <Flex flexDirection="row" key={i}>
          <ListIcon as={WarningIcon} color="red.500" />
          <ListItem color="red.500" fontSize="sm">
            {`Error uploading ${file.name}: ${e.message}`}
          </ListItem>
        </Flex>
      ))}
    </ListItem>
  ));

  return (
    <Flex flexDirection="column">
      <Box
        borderColor="gray.300"
        borderStyle="dashed"
        borderWidth="2px"
        rounded="md"
        shadow="sm"
        role="group"
        transition="all 150ms ease-in-out"
        flexDirection="column"
        {...(!disabled && {
          _hover: {
            shadow: 'md',
          },
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack
          height="100%"
          width="100%"
          display="flex"
          justify="center"
          spacing="4"
        >
          {!uploaded && !imageUrl && (
            <Stack p="8" textAlign="center" alignItems="center" spacing="1">
              <FileUploadIcon />
              <Heading fontSize="md" color="gray.700" fontWeight="bold">
                {uploadHeading}
              </Heading>
              <Text fontWeight="normal">{uploadSubheading}</Text>
            </Stack>
          )}
          <Flex flexDirection="column" flexWrap="wrap">
            {selectedFiles.map((file: File, index: number) => (
              <>
                <SelectedFile
                  key={`file__${index}`}
                  file={file}
                  url={fileToUrl ? fileToUrl(file) : URL.createObjectURL(file)}
                  isLoading={isLoading}
                  showPreview={showPreview}
                  fieldStyles={fieldStyles}
                  onRemove={() => {
                    setSelectedFiles(
                      selectedFiles.filter(
                        (selectedFile: File) => selectedFile.name !== file.name
                      )
                    );
                    setValue(name, '');
                  }}
                />
                {index !== selectedFiles.length - 1 && (
                  <Divider borderStyle="dashed" />
                )}
              </>
            ))}
            {imageUrl && !uploaded && (
              <SelectedFile
                url={imageUrl}
                onRemove={() => setValue(name, '')}
                isLoading={isLoading}
                showPreview={showPreview}
                fieldStyles={fieldStyles}
              />
            )}
          </Flex>
        </Stack>
      </Box>
      <List marginTop={2}>{errors}</List>
    </Flex>
  );
};

const FileField: FC<FieldProps<FileFieldSchema>> = ({
  id,
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
    tooltip,
    placeholder,
    defaultValue,
    validator,
    accept,
    maxFiles,
    uploadHeading,
    uploadSubheading,
    showPreview,
    isLoading,
    onDrop,
    enableUrlInput,
    fileToUrl,
    disabled,
    readOnly,
  } = field;
  const { register, control, setValue } = useFormContext();

  const { isReadOnly } = useContext(Ctx);

  const values = useWatch({ control });

  const fieldStyles = useStyles<FieldStyles>('fileField', styles);

  const errorMessage = useErrorMessage(name, label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values, index) : true;
  }, [values, shouldDisplay]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <FormControl
        data-testid={id}
        key={`${name}-control`}
        isRequired={isRequired}
        isInvalid={!!errorMessage}
        {...fieldStyles.control}
        isReadOnly={isReadOnly}
      >
        <LabelElement
          label={label}
          labelAddon={labelAddon}
          name={name}
          fieldStyles={fieldStyles}
          tooltip={tooltip}
        />
        {enableUrlInput && (
          <Input
            data-testid={id}
            type="text"
            aria-label={name}
            {...register(name)}
            placeholder={placeholder}
            defaultValue={defaultValue || ''}
            value={values[name]}
            {...fieldStyles.input}
            isDisabled={disabled}
            isReadOnly={isReadOnly || readOnly}
            marginBottom={2}
          />
        )}
        <FileUpload
          accept={accept}
          maxFiles={maxFiles}
          setValue={setValue}
          name={name}
          validator={validator}
          uploadHeading={uploadHeading}
          uploadSubheading={uploadSubheading}
          showPreview={showPreview}
          {...(enableUrlInput && { imageUrl: values[name] })}
          isLoading={isLoading}
          onDrop={onDrop}
          disabled={isReadOnly || disabled || readOnly}
          fileToUrl={fileToUrl}
          fieldStyles={fieldStyles}
        />
        {Boolean(helperText) && (
          <FormHelperText {...fieldStyles.helperText}>
            {helperText}
          </FormHelperText>
        )}
        <FormErrorMessage {...fieldStyles.errorMessage}>
          {errorMessage}
        </FormErrorMessage>
      </FormControl>
      {divideAfter && <Divider mt="8" />}
    </>
  );
};

export default FileField;
