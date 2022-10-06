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

const Thumbnail = ({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) => {
  return (
    <Flex flexDirection="row">
      <Box
        boxSizing="border-box"
        display="inline-flex"
        borderRadius={2}
        border="1px solid #EAEAEA"
        width="200px"
        height="200px"
        padding={1}
      >
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
      </Box>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Clear items"
        onClick={() => onRemove()}
        size="xs"
      />
    </Flex>
  );
};

type FileUploadProps = {
  name: string;
  setValue: UseFormSetValue<FieldValues>;
  validator?: (file: File) => FileError | FileError[] | null;
  accept?: Accept;
  maxFiles?: number;
  uploadHeading?: string;
  uploadSubheading?: string;
  showPreview?: boolean;
  imageUrl?: string;
  isLoading?: boolean;
  onDrop?: (files: File[]) => void;
  disabled?: boolean;
};

const FileUpload = ({
  name,
  setValue,
  validator,
  accept,
  maxFiles = 1,
  uploadHeading,
  uploadSubheading,
  showPreview,
  imageUrl,
  isLoading,
  onDrop,
  disabled,
}: FileUploadProps) => {
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
    disabled,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    // if (!imageUrl) {
    //   setValue(name, acceptedFiles);
    // } else {
    //   setValue(name, '');
    // }
    setSelectedFiles(acceptedFiles);
  }, [acceptedFiles]);

  const files = selectedFiles.map((file: File) => (
    <ListItem key={file.name}>
      {isLoading && <Spinner size="xs" color="orange" marginRight={2} />}
      {!isLoading && <ListIcon as={CheckCircleIcon} color="green.500" />}
      {file.name} - {round(file.size / (1024 * 1024), 2)} MB
    </ListItem>
  ));

  const errors = fileRejections.map(({ file, errors }: FileRejection) => (
    <ListItem key={file.name}>
      {errors.map((e) => (
        <Flex flexDirection="row">
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
        _hover={{
          shadow: 'md',
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack
          height="100%"
          width="100%"
          display="flex"
          alignItems="center"
          justify="center"
          spacing="4"
        >
          <Stack p="8" textAlign="center" alignItems="center" spacing="1">
            <FileUploadIcon />
            <Heading fontSize="md" color="gray.700" fontWeight="bold">
              {uploadHeading}
            </Heading>
            <Text fontWeight="normal">{uploadSubheading}</Text>
            <List>{errors}</List>
            <List>{files}</List>
          </Stack>
        </Stack>
      </Box>
      {showPreview && (imageUrl || !isEmpty(acceptedFiles)) && (
        <Text fontWeight="normal" marginTop="2">
          Preview:
        </Text>
      )}
      {showPreview && (
        <Flex flexDirection="row" flexWrap="wrap" columnGap="2">
          {selectedFiles.map((file: File) => (
            <Thumbnail
              url={URL.createObjectURL(file)}
              onRemove={() => setSelectedFiles([])}
            />
          ))}
        </Flex>
      )}
      {showPreview && imageUrl && (
        <Thumbnail url={imageUrl} onRemove={() => setValue(name, '')} />
      )}
    </Flex>
  );
};

const FileField: FC<FieldProps<FileFieldSchema>> = ({ id, name, field }) => {
  const {
    label,
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
  } = field;
  const { register, control, setValue } = useFormContext();

  const { isReadOnly } = useContext(Ctx);

  const values = useWatch({ control });

  const fieldStyles = useStyles<FieldStyles>('textField', styles);

  const errorMessage = useErrorMessage(name, label);

  const isVisible = useMemo(() => {
    return shouldDisplay ? shouldDisplay(values) : true;
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
            isDisabled={isReadOnly}
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
          disabled={isReadOnly}
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
