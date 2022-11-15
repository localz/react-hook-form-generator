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
  title: 'Workflows/Send email SES',
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
  debug: false,
  isReadOnly: false,
  formatSelectDefaultValues: true,
  formatSelectResults: true,
  helperText: '',
  formOptions: {
    defaultValues: {
      currentName: 'send_booking_codes_updated_email',
      name: 'send_booking_codes_updated_email',
      friendlyName: 'send_booking_codes_updated_email',
      description: '',
      actionType: 'send_email_ses',
      important: false,
      onSuccess: '',
      onFailure: '',
      input: {
        toEmails:
          '{{ if .context.input.isRedRun }} {{ .context.actions.get_location.emailEscal }} {{else}} {{ .context.input.vendorEmail }} {{end}}',
        ccEmails: '{{ .context.actions.get_location.emailEscal }}',
        bccEmails: '',
        fromEmail: 'bunnings-sausage-sizzle@localz.com',
        replyToEmails: null,
        subject: 'Your Bunnings Sausage Sizzle booking codes have been reset.',
        message: '<div></div>',
        extensionAudit: {
          enabled: false,
          orderNumber: null,
          subProjectId: null,
          additionalInfo: null,
          apiKey: null,
        },
      },
    },
  },
  schema: {
    name: {
      type: 'text',
      label: 'ID',
      isRequired: true,
      defaultValue: 'send_email_ses',
      placeholder: 'The name that this action will be referenced by',
      styles: {
        control: {
          visibility: 'hidden',
          height: '0px',
        },
      },
    },
    friendlyName: {
      type: 'text',
      label: 'Name',
      placeholder: 'A human readable name for the action',
      defaultValue: 'send_email_ses',
      isRequired: true,
    },
    description: {
      type: 'text',
      label: 'Description',
      placeholder: 'Describe what this action does',
    },
    important: {
      type: 'switch',
      label: 'Important',
      tooltip:
        'If enabled, this workflow will be marked as having failed if this action takes the onFailure route',
    },
    input: {
      type: 'object',
      properties: {
        subject: {
          type: 'text',
          label: 'Subject',
          isRequired: true,
        },
        toEmails: {
          type: 'text',
          label: 'To emails',
          tooltip:
            'Comma separate for multiple email addresses. Template variables can be used (e.g. {{.order.deliveryEmail}})',
          isRequired: true,
          placeholder: '{{.order.deliveryEmail}}',
        },
        fromEmail: {
          type: 'text',
          label: 'From email',
          isRequired: true,
          placeholder: 'example@example.com',
        },
        ccEmails: {
          label: 'CC emails',
          tooltip:
            'Comma separate for multiple email addresses. Template variables can be used (e.g. {{.order.deliveryEmail}})',
          type: 'text',
          placeholder: '{{.order.deliveryEmail}}',
        },
        bccEmails: {
          type: 'text',
          label: 'BCC emails',
          tooltip:
            'Comma separate for multiple email addresses. Template variables can be used (e.g. {{.order.deliveryEmail}})',
          placeholder: '{{.order.deliveryEmail}}',
        },
        replyToEmails: {
          type: 'array',
          label: 'Reply to emails',
          itemField: {
            type: 'object',
            label: 'Email',
            properties: {
              email: {
                type: 'text',
                label: 'Email',
                isRequired: true,
                placeholder: '{{.order.deliveryEmail}}',
              },
            },
          },
        },
        message: {
          label: 'Message',
          type: 'text',
        },
      },
    },
    onSuccess: {
      label: 'If action is successful',
      type: 'select',
      selectKey: 'actionOptions',
      placeholder: 'Select on success action',
      tooltip:
        'If this action is executed successfully, the action selected here will be executed next.',
      isClearable: true,
      defaultValue: '',
    },
    onFailure: {
      label: 'If action is not successful',
      type: 'select',
      selectKey: 'actionOptions',
      placeholder: 'Select on failure action',
      tooltip:
        'If this action fails, the action selected here will be executed next.',
      isClearable: true,
      defaultValue: '',
    },
  },
  buttons: {
    submit: {
      text: 'Save action',
    },
  },
  styles: {
    form: {
      submitButton: {
        variant: 'secondary',
      },
    },
  },
  selectOptions: {
    triggerWorkflowOptions: {
      isLoading: false,
      options: [],
    },
    smsTemplates: {
      isLoading: false,
      options: [],
    },
    actionOptions: {
      isLoading: false,
      options: [
        {
          label: 'get_location',
          value: 'get_location',
        },
        {
          label: 'Delay before sending',
          value: 'delay_838',
        },
      ],
    },
    internalWorkflows: {
      isLoading: false,
      options: [],
    },
    allWorkflows: {
      isLoading: false,
      options: [
        {
          label: 'Payment Account Created',
          value: '51df1866-2115-4810-88cb-6c91dce62299',
        },
        {
          label: 'Payment Checkout Completed',
          value: 'e7acb51b-318e-415b-bc4d-fb58de425c3a',
        },
        {
          label: 'Payment Refund Completed',
          value: 'cdf94dc1-0c46-4681-9441-650c913d95eb',
        },
        {
          label: 'Payment Vendor Codes Updated',
          value: '2908c673-3288-41b6-8125-a9cb5aa50840',
        },
        {
          label: 'Booking Created',
          value: '4813f3fb-0e3c-4372-a2b9-c0514e3ab934',
        },
        {
          label: 'Booking Deleted',
          value: '03e37b05-28fb-4131-9c24-d225aa945048',
        },
        {
          label: 'Booking Date Updated',
          value: 'e0a53dca-108d-4ee8-90d8-3e26f7802118',
        },
        {
          label: 'Booking Invite',
          value: '051db748-8fb0-40c0-9f02-ef7c448cb625',
        },
        {
          label: 'Booking Invite Declined',
          value: 'e703d27f-87fe-44c3-9398-e3413a194b26',
        },
        {
          label: 'Booking Invite Resent',
          value: '59bf86ec-ba6a-4d36-b82d-3af477002c99',
        },
        {
          label: 'Spaces - Customer Booking Registered',
          value: '2bcc6405-2fb6-4c5b-bc82-2f89fe0fe4c9',
        },
        {
          label: 'Spaces - Customer Booking Reminder',
          value: '5f343e70-2ac8-4c51-b190-22731d4d9c87',
        },
        {
          label: 'Spaces - Customer Booking Deleted',
          value: '4439f407-933b-447a-9334-4c4173d5ce76',
        },
        {
          label: 'Spaces - Customer Booking Updated',
          value: '2ae5c446-1032-450e-ace4-441522ec29b1',
        },
        {
          label: 'Sizzle - Vendor Booking Reminder',
          value: '05e09e07-47a4-46ee-8a4a-e2f1800fc7a9',
        },
      ],
    },
  },
};
