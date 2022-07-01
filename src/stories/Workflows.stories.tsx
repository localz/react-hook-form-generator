import React from 'react';
import { ComponentStory } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '..';
import Z from 'zod';

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

const validationSchema = Z.object({
  username: Z.string({
    required_error: 'Username is required',
  }),
  password: Z.string({
    required_error: 'Password is required',
  }).min(8),
});

export const Workflows = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Workflows.args = {
  title: 'Workflows',
  handleSubmit: (values) => {
    alert(JSON.stringify(values));
  },
  formOptions: {
    resolver: zodResolver(validationSchema),
  },
  buttons: {
    submit: {
      text: 'Save',
    },
  },
  schema: {
    name: {
      type: 'text',
      label: 'Name',
      isRequired: true,
      defaultValue: 'Delay action',
      tooltip: 'What is the workflow called?',
    },
    friendlyName: { type: 'text', label: 'Friendly name', isRequired: true },
    description: { type: 'text', label: 'Description' },
    important: {
      type: 'switch',
      label: 'Important',
      isRequired: true,
      tooltip:
        'If enabled, this workflow will be marked as having failed if this action takes the onFailure route',
    },
    input: {
      type: 'object',
      properties: {
        delay: {
          label: 'Delay duration',
          placeholder: '1h',
          isRequired: true,
          type: 'text',
        },
        roundToNotificationHours: {
          defaultValue: true,
          label: 'Round the delay to notification hours?',
          tooltip:
            'Enables support for only sending notifications during notification hours. If enabled, this will extend the duration of the delay to coincide with the next configured notification window',
          type: 'switch',
        },
        nextAction: {
          label: 'Next action',
          type: 'select',
          options: [
            {
              value: 'action-2',
              label: 'action-2',
            },
            {
              value: 'action-3',
              label: 'action-3',
            },
            {
              value: 'action-4',
              label: 'action-4',
            },
          ],
        },
      },
    },
  },
};
