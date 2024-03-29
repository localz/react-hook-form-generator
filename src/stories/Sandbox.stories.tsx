import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
  ChakraProvider,
  Flex,
  Text,
  Circle,
  Box,
  Button,
} from '@chakra-ui/react';
import { Form } from '..';
import get from 'lodash.get';

const options = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3 },
  { label: 'Four', value: 4 },
  { label: 'Five', value: 5 },
  { label: 'Six', value: 6 },
];

/*
 * NOTE: You can't bind args for this story because it passes react context as an arg
 * which breaks Storybook and makes it throw a very confusing error
 */

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Sandbox',
  displayName: 'Sandbox',
  component: Form,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Form> = (args) => (
  <ChakraProvider>
    <Form {...args} />
  </ChakraProvider>
);

const renderButton = (values: any) => {
  return (
    <Button
      size="sm"
      variant="solid"
      onClick={() => alert(JSON.stringify(values, null, 2))}
    >
      Promote
    </Button>
  );
};

export const Sandbox = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Sandbox.args = {
  title: 'Sandbox',
  helperText: 'Some text that explains some stuff',
  handleSubmit: (values) => {
    alert(JSON.stringify(values, null, 2));
  },
  buttons: {
    submit: {
      text: 'Save',
    },
    customButtons: [{ render: renderButton }],
  },
  isReadOnly: false,
  formOptions: {
    defaultValues: {
      secret: 'secretPassword',
      color: '#000000',
      options: [
        {
          label: {
            label: 'Two',
            value: 2,
          },
        },
      ],
      input: {
        payloads: JSON.stringify({
          wow: 'wow',
        }),
      },
      expectedActions: [
        {
          name: 'test_sms',
          input: {
            orderId: '123',
          },
        },
      ],
      toCopy: 'Copy this',
      imageFile:
        'https://localz-public-assets-master-ap-southeast-2.s3.ap-southeast-2.amazonaws.com/media_api_green/vXD5hazjLrwcqf3V0FmP9CiqUCa4Cv7TCOOa6000/vXD5hazjLrwcqf3V0FmP9CiqUCa4Cv7TCOOa6000-customerPortalLogo.png/vXD5hazjLrwcqf3V0FmP9CiqUCa4Cv7TCOOa6000_vXD5hazjLrwcqf3V0FmP9CiqUCa4Cv7TCOOa6000-customerPortalLogo.png_1614580263540_0.png',
    },
  },
  styles: {
    form: {
      button: {
        variant: 'ghost',
      },
    },
    fileField: {
      button: {
        variant: 'solid',
      },
    },
    codeField: {
      button: {
        variant: 'ghost',
      },
    },
    dragDropField: {
      selectedContainer: {
        width: '70%',
      },
      unselectedContainer: {
        width: '30%',
      },
    },
    headingField: {
      input: {
        size: 'lg',
        fontWeight: 'bold',
      },
    },
  },

  schema: {
    secret: {
      type: 'secret',
      toggleIcon: 'eye',
      label: 'Password',
      clearOriginalValue: true,
      copyToClipboard: true,
      isRequired: true,
    },
    expectedActions: {
      type: 'dragDrop',
      label: 'Expected actions',
      dragText: 'Drag actions here',
      noOptionsText: 'No actions remaining',
      optionField: {
        type: 'object',
        properties: {
          name: {
            type: 'heading',
            divideAfter: true,
          },
          input: {
            type: 'code',
            language: 'json',
            label: 'Action input',
            isCollapsible: true,
            height: '400px',
          },
        },
      },
      optionToString: (values) => values.name,
      options: [
        { name: 'test_sms', input: null },
        { name: 'check_attribute', input: null },
      ],
    },
    selectSomething: {
      type: 'select',
      label: 'Select something',
      generateOptions: (values: any, index?: number | null) =>
        get(values, 'arrayField', []).map((val: any) => {
          return { label: val, value: val };
        }),
      options: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
        { label: 'Three', value: 3 },
        { label: 'Four', value: 4 },
        { label: 'Five', value: 5 },
      ],
    },
    name: {
      type: 'text',
      label: 'Name',
      variant: 'unstyled',
      isRequired: true,
      divideAfter: true,
      copyToClipboard: true,
      inputValidation: {
        validator: async (value) => {
          return value.length < 10;
        },
        loading: false,
        validationError: 'Name can only be less than 10 characters long',
      },
      deriveValue: (values) => {
        return values.color;
      },
      renderAfter: (values) => {
        return (
          <Box bg="gray.400" p="2">
            This is a custom render after the name field
            <br />
            Name: {values.name}
          </Box>
        );
      },
    },
    toCopy: {
      type: 'heading',
      copyToClipboard: true,
      tooltip: 'You can copy this!',
    },
    arrayField: {
      type: 'array',
      label: 'Regular array',
      itemField: {
        type: 'text',
        label: 'Text',
      },
    },
    nestedField: {
      type: 'array',
      label: 'Nested arrays',
      itemField: {
        type: 'object',
        label: 'Single array',
        properties: {
          singleField: {
            type: 'array',
            label: '',
            itemField: {
              type: 'object',
              label: 'Object',
              properties: {
                label: {
                  type: 'select',
                  label: 'Label',
                  options: options,
                },
                selectSomething: {
                  type: 'select',
                  label: 'Select something',
                  generateOptions: (values: any, index?: number | null) =>
                    get(values, `nestedField[${index}].singleField`, []).map(
                      ({ label }: { label: string }) => {
                        return label;
                      }
                    ),
                },
                hidden: {
                  type: 'text',
                  label: 'Hidden field',
                  shouldDisplay: (values, _, nestedIndex) => {
                    const option = get(
                      values,
                      `nestedField[${get(nestedIndex, 0)}].singleField[${get(
                        nestedIndex,
                        1
                      )}].label.value`
                    );
                    return nestedIndex ? option === 3 : true;
                  },
                },
              },
            },
          },
        },
      },
    },
    color: {
      type: 'color',
      label: 'Color',
      tooltip: 'Select a color with this handy picker!',
      placeholder: 'Select a color...',
    },
    imageFile: {
      type: 'file',
      label: 'Image upload',
      validator: (file: File) => {
        const fileSizeMb = file.size / (1024 * 1024);
        const MAX_FILE_SIZE = 1;
        if (fileSizeMb > MAX_FILE_SIZE) {
          return {
            code: 'name-too-large',
            message: `Max file size is 1 MB`,
          };
        }
        return null;
      },
      accept: {
        'image/png': ['.png'],
      },
      maxFiles: 2,
      placeholder: 'Enter an image URL...',
      uploadSubheading: '...or drop an image here',
      showPreview: true,
      tooltip: 'Only image files allowed',
      enableUrlInput: true,
      fileToUrl: (file: File) => URL.createObjectURL(file),
    },
    options: {
      type: 'array',
      label: 'Contents',
      isCollapsible: true,
      defaultIsOpen: true,
      draggable: true,
      itemField: {
        type: 'object',
        label: 'Object',
        tooltip: 'Try selecting label to be 1',
        properties: {
          label: {
            type: 'select',
            label: 'Label',
            options: options,
            formatOptionLabel: (option) => {
              return (
                <Flex alignItems="center">
                  <Circle size="10px" bg="green" marginRight="10px" />
                  <Text>{(option as { label: string }).label}</Text>
                </Flex>
              );
            },
          },
          value: {
            type: 'text',
            label: 'Surprise input!',
            shouldDisplay: (values, index) =>
              get(values, `options[${index}].label.value`) === 1,
          },
        },
      },
    },
    input: {
      type: 'object',
      divideAfter: true,
      properties: {
        payloads: {
          label: 'Payloads',
          type: 'code',
          language: 'json',
          tooltip: 'JSON array string. You can also use templating',
          isRequired: true,
          isCollapsible: true,
          defaultIsOpen: true,
        },
        file: {
          type: 'file',
          label: 'File upload',
          maxFiles: 5,
          uploadHeading: 'Drop your file here',
          tooltip: 'Try uploading multiple files',
        },
      },
    },
  },
};
