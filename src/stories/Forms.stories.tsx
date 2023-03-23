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

export const Json = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Json.args = {
  title: 'Json',
  handleSubmit: (values) => {
    alert(JSON.stringify(values));
  },
  formOptions: {
    defaultValues: {
      jaysonWithDefaultValue: JSON.stringify({
        name: 'Default value',
      }),
    },
  },
  buttons: {
    submit: {
      text: 'Submit',
    },
  },
  schema: {
    jayson: {
      type: 'code',
      language: 'json',
      label: 'Some JSON input',
    },
    jaysonWithDefaultValue: {
      isCollapsible: true,
      defaultIsOpen: true,
      type: 'code',
      language: 'json',
      label: 'Some JSON input with a default value',
    },
  },
};

export const Go = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Go.args = {
  title: 'Go',
  handleSubmit: (values) => {
    alert(JSON.stringify(values));
  },
  formOptions: {
    defaultValues: {
      golang:
        '[ {{ $first := true }} {{ range $idx, $elem := .context.actions.vars.json.images }} {{ if not $first }},{{ end }} { {{ if $first }} "note": "{{ replace (replace $.context.actions.vars.json.note "\n" `\n` -1) `"` `"` -1 }}", {{ end }} "imageUrl": "{{ $elem.value }}", "imageName": "{{ $elem.name }}", "fileName": "image_{{ index (split uuid "-") 0 }}.jpg", {{ with $x := $.context.actions.get_order.order.specific.dynamicsUserId }} "dynamicsUserId": "{{ $x }}", {{ end }} "serviceTaskId": "{{ $.context.actions.vars.json.serviceTaskId }}", {{ with $x := $.context.input.subProjectId }}"subProjectId":"{{ $x }}",{{ end }} "orderNumber": "{{ $.context.input.orderNumber }}" } {{ $first = false }} {{ end }} ]',
    },
  },
  buttons: {
    submit: {
      text: 'Submit',
    },
  },
  schema: {
    golang: {
      type: 'code',
      language: 'go',
      label: 'Some JSON input',
    },
    payloads: {
      type: 'code',
      language: 'go',
      label: 'Payloads',
    },
  },
};

export const Html = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Html.args = {
  title: 'Html',
  handleSubmit: (values) => {
    alert(JSON.stringify(values));
  },
  formOptions: {
    defaultValues: {
      htmlWithDefaultValue: '<p>Hello world!</p>',
    },
  },
  buttons: {
    submit: {
      text: 'Submit',
    },
  },
  schema: {
    html: {
      type: 'code',
      language: 'html',
      label: 'Some HTML input',
    },
    htmlWithDefaultValue: {
      type: 'code',
      language: 'html',
      label: 'Some HTML input with a default value',
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
        return value.show;
      },
    },
    alwaysVisibleField: {
      type: 'text',
      htmlInputType: 'password',
      label: 'Password',
      isRequired: true,
      defaultValue: '123',
    },
  },
};

const numberValidation = Z.object({
  etaWindowMinutes: Z.number({
    required_error: 'etaWindowMinutes is required',
  })
    .min(1)
    .max(60),
});

export const NumberField = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
NumberField.args = {
  title: 'Number field',
  handleSubmit: (values) => {
    alert(JSON.stringify(values));
  },
  formOptions: {
    resolver: zodResolver(numberValidation),
  },
  buttons: {
    submit: {
      text: 'Submit',
    },
  },
  schema: {
    etaWindowMinutes: {
      type: 'number',
      label: 'etaWindowMinutes',
      defaultValue: 15,
      tooltip: 'This is a tooltip',
    },
  },
};
