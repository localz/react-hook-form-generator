import React from 'react';
import { ComponentStory } from '@storybook/react';
import { ChakraProvider, Circle, Flex, Text } from '@chakra-ui/react';
import { Form } from '..';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

const validationSchema = z.object({
  withDefaultValue: z.object(
    {
      value: z.enum(['RS256', 'HS256']),
      label: z.enum(['RS256', 'HS256']),
    },
    {
      required_error: 'With default value is required',
    }
  ),
});

export const Code = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Code.args = {
  title: 'Select',
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
  selectOptions: {
    nextActions: {
      isLoading: false,
      options: [
        { value: 'action-1', label: 'Action one' },
        { value: 'action-2', label: 'Action two' },
      ],
    },
    actionOptions: {
      isLoading: false,
      options: [
        { value: 'action-1', label: 'Action one' },
        { value: 'action-2', label: 'Action two' },
      ],
    },
  },
  formOptions: {
    resolver: zodResolver(validationSchema),
    defaultValues: {
      fromContext: 'action-2',
    },
  },
  schema: {
    codeOne: {
      placeholder: '',
      label: 'With autocomplete',
      type: 'code',
      language: 'sms',
    },
  },
};
