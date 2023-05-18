import React from 'react';
import { ComponentStory } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Form } from '..';

/*
 * NOTE: You can't bind args for this story because it passes react context as an arg
 * which breaks Storybook and makes it throw a very confusing error
 */

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Code',
  displayName: 'Code',
  component: Form,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Form> = (args) => (
  <ChakraProvider>
    <Form {...args} />
  </ChakraProvider>
);

export const Code = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Code.args = {
  title: 'Code field',
  helperText: 'Some text that explains some stuff',
  handleSubmit: (values) => {
    alert(JSON.stringify(values, null, 2));
  },
  formOptions: {
    defaultValues: {
      smsInput: 'Wowie',
    },
  },
  buttons: {
    submit: {
      text: 'Save',
    },
  },
  isReadOnly: false,

  schema: {
    smsInput: {
      placeholder: '',
      label: 'SMS input',
      type: 'code',
      language: 'sms',
      editorProps: {
        wordWrap: 'on',
      },
    },
  },
};
