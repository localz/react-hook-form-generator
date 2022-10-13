import React from 'react';
import { ComponentStory } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Form } from '..';
import { schema, defaultValues, selectOptions } from './data/workflows';

/*
 * NOTE: You can't bind args for this story because it passes react context as an arg
 * which breaks Storybook and makes it throw a very confusing error
 */

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Workflows',
  displayName: 'tes',
  component: Form,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Form> = (args) => (
  <ChakraProvider>
    <Form {...args} />
  </ChakraProvider>
);

export const Workflows = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Workflows.args = {
  title: 'Workflows',
  helperText: 'Some text that explains some stuff',
  handleSubmit: (values) => {
    alert(JSON.stringify(values, null, 2));
  },
  buttons: {
    submit: {
      text: 'Save',
    },
  },
  isReadOnly: false,
  selectOptions,
  formOptions: {
    defaultValues,
  },
  formatSelectDefaultValues: true,
  formatSelectResults: true,
  schema,
};
