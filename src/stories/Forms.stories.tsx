import React from 'react';
import { ComponentStory } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '..';
import * as Z from 'zod';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Form',
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
  }).min(1),
  password: Z.string({
    required_error: 'Password is required',
  }).min(8),
});

export const Login = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Login.args = {
  isReadOnly: true,
  title: 'Login',
  handleSubmit: (values) => {
    alert(JSON.stringify(values));
  },
  formOptions: {
    resolver: zodResolver(validationSchema),
  },
  buttons: {
    submit: {
      text: 'Login',
    },
  },
  schema: {
    username: {
      type: 'text',
      label: 'Username',
      defaultValue: 'tom',
    },
    password: {
      type: 'text',
      htmlInputType: 'password',
      label: 'Password',
      isRequired: true,
      defaultValue: '123',
    },
  },
};

export const ConditionalRendering = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ConditionalRendering.args = {
  title: 'Login',
  handleSubmit: (values) => {
    alert(JSON.stringify(values));
  },
  formOptions: {
    resolver: zodResolver(validationSchema),
  },
  buttons: {
    submit: {
      text: 'Login',
    },
  },
  schema: {
    show: {
      type: 'switch',
      label: 'Show hidden field',
    },
    hiddenField: {
      type: 'text',
      htmlInputType: 'password',
      label: 'Password',
      isRequired: true,
      defaultValue: '123',
      shouldDisplay: (value) => {
        console.log({ value });

        return value.show;
      },
    },
  },
};
