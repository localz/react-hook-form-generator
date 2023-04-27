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
  title: 'Example/Select',
  displayName: 'Select',
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

export const Select = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Select.args = {
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
    input: {
      type: 'object',
      label: 'Parent object',
      properties: {
        nestedSelect: {
          placeholder: 'Select option...',
          label: 'Nested select',
          type: 'select',
          selectKey: 'actionOptions',
          renderAfter: () => {
            return <a>Some link</a>;
          },
        },
      },
    },
    fromContext: {
      placeholder: 'Select option...',
      label: 'From context',
      type: 'select',
      selectKey: 'actionOptions',
      renderAfter: () => {
        return <a>Some link</a>;
      },
    },
    multiSelect: {
      placeholder: 'Select option...',
      label: 'Multi select',
      type: 'select',
      selectKey: 'actionOptions',
      isMulti: true,
    },
    withDefaultValue: {
      label: 'With a default value',
      type: 'select',
      options: [
        { value: 'RS256', label: 'RS256' },
        { value: 'HS256', label: 'HS256' },
      ],
      defaultValue: { value: 'HS256', label: 'HS256' },
      isRequired: true,
    },

    stickyHeader: {
      type: 'select',
      label: 'Sticky header',
      hasStickyGroupHeaders: true,
      options: Array(5)
        .fill(null)
        .map((_, i) => {
          return {
            label: `Option ${i}`,
            value: `parent-${i}`,
            options: Array(5)
              .fill(null)
              .map((_, j) => {
                return {
                  label: `Child ${j}`,
                  value: `child-${i}-${j}`,
                };
              }),
          };
        }),
    },
    customLabel: {
      placeholder: 'Select option...',
      label: 'Custom label multi select',
      type: 'select',
      isMulti: true,
      options: Array(5)
        .fill(null)
        .map((_, i) => {
          return {
            label: `Option ${i}`,
            value: `parent-${i}`,
            options: Array(5)
              .fill(null)
              .map((_, j) => {
                return {
                  label: `Child ${j}`,
                  value: `child-${i}-${j}`,
                };
              }),
          };
        }),
      formatOptionLabel: (option) => {
        return (
          <Flex alignItems="center">
            <Circle size="10px" bg="green" marginRight="10px" />
            <Text>{(option as { label: string }).label}</Text>
          </Flex>
        );
      },
    },
  },
};
