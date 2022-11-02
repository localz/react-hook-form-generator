import React from 'react';
import { ComponentStory } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Form } from '..';
import { schema, defaultValues, selectOptions } from './data/workflows';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';

/*
 * NOTE: You can't bind args for this story because it passes react context as an arg
 * which breaks Storybook and makes it throw a very confusing error
 */

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Workflows/Action',
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
    resolver: zodResolver(
      object({
        name: string(),
        description: string().optional(),
        input: object({
          comments: string({
            required_error: 'Comments is required',
          }).min(1, 'Comments is required'),
        }),
      })
    ),
  },
  formatSelectDefaultValues: true,
  formatSelectResults: true,
  schema,
  debug: true,
};
