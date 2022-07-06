import React from 'react';
import { ComponentStory } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProps } from '..';
import Z from 'zod';

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

const ActionOptionsContext = React.createContext<{
  options: Array<{ value: string; label: string }>;
}>({ options: [] });

const validationSchema = Z.object({
  username: Z.string({
    required_error: 'Username is required',
  }),
  password: Z.string({
    required_error: 'Password is required',
  }).min(8),
});

const args: FormProps = {
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
  reactContext: ActionOptionsContext,
  schema: {
    name: {
      type: 'text',
      label: 'Name',
      isRequired: true,
      defaultValue: 'compare',
    },
    friendlyName: { type: 'text', label: 'Friendly name', isRequired: true },
    description: { type: 'text', label: 'Description', isRequired: true },
    important: {
      type: 'switch',
      label: 'Important',
      isRequired: true,
      tooltip:
        'If enabled, this workflow will be marked as having failed if this action takes the onFailure route',
      helperText: 'help',
    },
    input: {
      type: 'object',
      properties: {
        conditionType: {
          label: 'Condition',
          type: 'text',
          isRequired: true,
        },
        argument: {
          label: 'Input field or function to match',
          isRequired: true,
          type: 'text',
        },
        nextAction: {
          label: 'Next action',
          type: 'select-options-from-context',
          optionsKey: 'options',
        },
      },
    },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Form> = () => (
  <ActionOptionsContext.Provider
    value={{
      options: [
        { value: 'action-1', label: 'Action one' },
        { value: 'action-2', label: 'Action two' },
      ],
    }}
  >
    <ChakraProvider>
      <Form {...args} />
    </ChakraProvider>
  </ActionOptionsContext.Provider>
);

export const Workflows = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
