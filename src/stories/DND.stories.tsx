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
  title: 'Example/DND',
  displayName: 'DND',
  component: Form,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Form> = (args) => (
  <ChakraProvider>
    <Form {...args} />
  </ChakraProvider>
);

export const DND = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DND.args = {
  title: "Drag n' drop",
  helperText: '',
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
      isLoading: true,
      options: [
        { value: 'action-1', label: 'Action one' },
        { value: 'action-2', label: 'Action two' },
      ],
    },
  },
  formOptions: {
    defaultValues: {
      input: {
        conditionType: 'is_greater_than',
      },
      triggers: [
        {
          label: 'order_rescheduled',
          value: 'order_rescheduled',
        },
        {
          label: 'workflows_internal',
          value: 'workflows_internal',
        },
      ],
      textList: [
        'No one will be home',
        "I'm not feeling well",
        'I no longer need the appointment',
      ],
      objects: [
        {
          label: 'order_rescheduled',
          value: 'order_rescheduled',
        },
        {
          label: 'workflows_internal',
          value: 'workflows_internal',
        },
      ],
    },
  },
  schema: {
    drag: {
      type: 'array',
      draggable: true,
      itemField: {
        type: 'object',

        properties: {
          key: {
            type: 'text',
            label: 'key',
          },
          value: {
            type: 'text',
            label: 'Value',
          },
        },
      },
    },
  },
};
