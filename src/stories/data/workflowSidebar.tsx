import { FormProps } from '../..';
import { triggerOptions } from './workflows';

export const schema: FormProps['schema'] = {
  name: {
    type: 'text',
    label: 'Workflow name',
    isRequired: true,
  },
  description: {
    label: 'Description',
    type: 'text',
    divideAfter: true,
  },
  triggers: {
    type: 'array',
    label: 'Triggers',
    itemField: {
      type: 'select',
      label: 'Trigger type',
      options: triggerOptions,
    },
  },
  config: {
    type: 'object',
    properties: {
      fetchOrder: {
        type: 'switch',
        label: 'Fetch order',
        tooltip:
          "When enabled, the order will be automatically fetched before each action runs, allowing you to use properties from the order inside the workflow's actions. The order will always be up to date, even after a delay.",
      },
      fetchLocation: {
        type: 'switch',
        label: 'Fetch location',
        tooltip:
          "When enabled, the order's location will be automatically fetched before each action runs, allowing you to use properties from the order's location in the workflow's actions. The location will always be up to date, even after a delay.",
      },
      fetchExtensionAudits: {
        type: 'switch',
        label: 'Fetch extension audits',
        tooltip:
          "When enabled, the order's extension audits will be automatically fetched before each action runs, allowing you to use the extension audits inside workflow's actions. The extension audits will always be up to date, even after a delay.",
      },
      safeToRerun: {
        type: 'switch',
        label: 'Safe to rerun',
        tooltip:
          'When enabled, this workflow can be re-run from the logs page.',
      },
    },
  },
};

export const defaultValues = {
  name: 'default name',
  description: '',
  triggers: ['order_feedback_submitted'],
  config: {
    fetchOrder: true,
    fetchLocation: false,
    fetchExtensionAudits: false,
    safeToRerun: false,
  },
};
