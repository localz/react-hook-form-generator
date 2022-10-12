import { FormProps } from '../../components/Form';
import { formatOutput } from '../formatOutput';

const triggerOptions = [
  { label: 'auspost_job_updated', value: 'auspost_job_updated' },
  { label: 'auspost_route_created', value: 'auspost_route_created' },
  { label: 'chat_channel_deleted', value: 'chat_channel_deleted' },
  { label: 'chat_message_created', value: 'chat_message_created' },
  { label: 'create_collection_order', value: 'create_collection_order' },
  { label: 'create_delivery_job', value: 'create_delivery_job' },
  { label: 'create_delivery_route', value: 'create_delivery_route' },
  { label: 'delivery_demo_triggered', value: 'delivery_demo_triggered' },
  { label: 'demo_triggered', value: 'demo_triggered' },
  { label: 'eta_fence_entered', value: 'eta_fence_entered' },
  { label: 'fieldaware_order_created', value: 'fieldaware_order_created' },
  { label: 'fieldaware_order_updated', value: 'fieldaware_order_updated' },
  { label: 'geofence_triggered', value: 'geofence_triggered' },
  { label: 'masternaut_order_created', value: 'masternaut_order_created' },
  { label: 'masternaut_order_updated', value: 'masternaut_order_updated' },
  { label: 'order_acknowledged', value: 'order_acknowledged' },
  { label: 'order_attendant_allocated', value: 'order_attendant_allocated' },
  { label: 'order_cancelled', value: 'order_cancelled' },
  { label: 'order_checked_in', value: 'order_checked_in' },
  { label: 'order_comments_added', value: 'order_comments_added' },
  { label: 'order_completed', value: 'order_completed' },
  { label: 'order_created', value: 'order_created' },
  { label: 'order_diff', value: 'order_diff' },
  { label: 'order_expired', value: 'order_expired' },
  { label: 'order_failed_completed', value: 'order_failed_completed' },
  { label: 'order_feedback_submitted', value: 'order_feedback_submitted' },
  { label: 'order_handed_over', value: 'order_handed_over' },
  { label: 'order_ready', value: 'order_ready' },
  { label: 'order_rescheduled', value: 'order_rescheduled' },
  { label: 'order_specific_changed', value: 'order_specific_changed' },
  {
    label: 'orders_completed_for_stopid_by_subprojectid',
    value: 'orders_completed_for_stopid_by_subprojectid',
  },
  {
    label: 'orders_failedcompleted_for_stopid_by_subprojectid',
    value: 'orders_failedcompleted_for_stopid_by_subprojectid',
  },
  { label: 'payment_account_created', value: 'payment_account_created' },
  {
    label: 'payment_account_creation_failed',
    value: 'payment_account_creation_failed',
  },
  {
    label: 'payment_booking_codes_updated',
    value: 'payment_booking_codes_updated',
  },
  { label: 'payment_booking_confirmed', value: 'payment_booking_confirmed' },
  { label: 'payment_booking_created', value: 'payment_booking_created' },
  { label: 'payment_booking_declined', value: 'payment_booking_declined' },
  { label: 'payment_booking_deleted', value: 'payment_booking_deleted' },
  {
    label: 'payment_booking_invitation_code_updated',
    value: 'payment_booking_invitation_code_updated',
  },
  { label: 'payment_booking_summary', value: 'payment_booking_summary' },
  { label: 'payment_booking_updated', value: 'payment_booking_updated' },
  { label: 'payment_checkout_completed', value: 'payment_checkout_completed' },
  {
    label: 'payment_customer_booking_cancelled',
    value: 'payment_customer_booking_cancelled',
  },
  {
    label: 'payment_customer_booking_deleted',
    value: 'payment_customer_booking_deleted',
  },
  {
    label: 'payment_customer_booking_registered',
    value: 'payment_customer_booking_registered',
  },
  {
    label: 'payment_customer_booking_reminder',
    value: 'payment_customer_booking_reminder',
  },
  {
    label: 'payment_customer_booking_updated',
    value: 'payment_customer_booking_updated',
  },
  { label: 'payment_refund_completed', value: 'payment_refund_completed' },
  {
    label: 'payment_vendor_booking_reminder',
    value: 'payment_vendor_booking_reminder',
  },
  {
    label: 'payment_vendor_codes_updated',
    value: 'payment_vendor_codes_updated',
  },
  { label: 'premonition_shift_created', value: 'premonition_shift_created' },
  { label: 'premonition_shift_updated', value: 'premonition_shift_updated' },
  { label: 'premonition_stop_created', value: 'premonition_stop_created' },
  { label: 'premonition_stop_updated', value: 'premonition_stop_updated' },
  {
    label: 'rate_my_experience_submission_updated',
    value: 'rate_my_experience_submission_updated',
  },
  { label: 'salesforce_order_created', value: 'salesforce_order_created' },
  { label: 'salesforce_order_updated', value: 'salesforce_order_updated' },
  {
    label: 'salesforce_resource_updated',
    value: 'salesforce_resource_updated',
  },
  { label: 'servicemax_order_created', value: 'servicemax_order_created' },
  { label: 'servicemax_order_updated', value: 'servicemax_order_updated' },
  { label: 'sms_notification', value: 'sms_notification' },
  { label: 'sms_reply_received', value: 'sms_reply_received' },
  { label: 'track_located', value: 'track_located' },
  { label: 'track_started', value: 'track_started' },
  {
    label: 'track_started_for_stopid_by_subprojectid',
    value: 'track_started_for_stopid_by_subprojectid',
  },
  { label: 'update_collection_order', value: 'update_collection_order' },
  { label: 'update_delivery_job', value: 'update_delivery_job' },
  { label: 'update_delivery_jobs', value: 'update_delivery_jobs' },
  { label: 'user_logged_in', value: 'user_logged_in' },
  { label: 'workflows_internal', value: 'workflows_internal' },
];

const schema: FormProps['schema'] = {
  name: {
    type: 'text',
    label: 'Name',
    isRequired: true,
    defaultValue: 'compare',
    divideAfter: true,
  },
  friendlyName: { type: 'text', label: 'Friendly name' },
  description: { type: 'text', label: 'Description' },
  dateTime: {
    type: 'date',
    label: 'Date',
    format: 'MM/dd/yyyy hh:mm a',
    showTime: true,
    placeholder: 'Select date and time',
    isRequired: true,
    isClearable: true,
    timeInterval: 15,
    defaultValue: new Date(),
  },
  important: {
    type: 'switch',
    label: 'Important',
    tooltip:
      'If enabled, this workflow will be marked as having failed if this action takes the onFailure route',
    helperText: 'help',
  },
  triggers: {
    type: 'array',
    label: 'Triggers',
    isCollapsable: true,
    defaultIsOpen: true,
    draggable: true,
    itemField: {
      type: 'select',
      label: 'Trigger type',
      options: triggerOptions,
    },
  },
  multiSelectOption: {
    placeholder: 'Multi select',
    label: 'Multi select',
    type: 'select',
    isMulti: true,
    options: triggerOptions,
  },
  split: {
    type: 'object',
    label: 'Split',
    properties: {
      input: {
        type: 'object',
        properties: {
          argument: {
            type: 'text',
            label: 'Input field or function to match',
            tooltip: 'Value or expression to compare',
            placeholder: '{{ .order.orderStatus }}',
          },
          cases: {
            type: 'array',
            label: 'Cases',
            tooltip:
              'A list of different values, with the next action to execute to when a match occurs',
            itemField: {
              type: 'object',
              properties: {
                value: {
                  type: 'text',
                  label: 'Case to test',
                  tooltip: 'The value to compare against argument',
                  placeholder: 'PENDING',
                  isRequired: true,
                },
                onMatch: {
                  label: 'Next action',
                  type: 'select',
                  isRequired: true,
                  selectKey: 'actionOptions',
                  placeholder: 'Select next action',
                  tooltip: 'The next action to execute when a match occurs',
                },
              },
            },
          },
        },
      },
    },
  },
  input: {
    type: 'object',
    divideAfter: true,
    properties: {
      comments: {
        type: 'textArea',
        label: 'Comments',
        placeholder: 'A textarea placeholder',
      },
      payloads: {
        label: 'Payloads',
        type: 'json',
        tooltip: 'JSON array string. You can also use templating',
        isRequired: true,
      },
      someNumber: {
        type: 'number',
        label: 'Number',
        min: 0,
        max: 5,
        format: (val: number) => `$` + (val || 0),
        parse: (val: string) => parseInt(val.replace(/^\$/, '')),
      },
      someCheckbox: {
        type: 'checkbox',
        label: 'Checkboxes',
        checkboxes: [
          {
            label: 'Checkbox one',
            name: 'one',
          },
          {
            label: 'Checkbox two',
            name: 'two',
          },
          {
            label: 'Checkbox three',
            name: 'three',
          },
        ],
      },
      conditionType: {
        label: 'Condition',
        type: 'select',
        defaultValue: { label: 'is_greater_than', value: 'is_greater_than' },
        options: [
          { label: 'is_equal', value: 'is_equal' },
          { label: 'is_not_equal', value: 'is_not_equal' },
          { label: 'is_less_than', value: 'is_less_than' },
          { label: 'is_greater_than', value: 'is_greater_than' },
        ],
        isRequired: true,
      },
      argument: {
        label: 'Input field or function to match',
        type: 'text',
      },
      headers: {
        label: 'Headers',
        type: 'array',
        isCollapsable: true,
        itemField: {
          type: 'object',
          styles: {
            objectContainer: {
              direction: 'row',
              align: 'stretch',
            },
            propertyContainer: {
              flex: 1,
            },
          },
          properties: {
            key: {
              isRequired: true,
              type: 'text',
              label: 'Key',
            },
            value: {
              isRequired: true,
              type: 'text',
              label: 'Value',
              htmlInputType: 'text',
            },
          },
        },
      },
    },
  },
  nextAction: {
    placeholder: 'Select next action',
    label: 'Next action',
    type: 'select',
    selectKey: 'nextActions',
  },
  onSuccess: {
    placeholder: 'Select success action',
    label: 'On success',
    type: 'select',
    selectKey: 'actionOptions',
  },
};

const values = {
  input: {
    conditionType: { label: 'is_equal', value: 'is_equal' },
    comments: '',
    payloads: { Hello: true },
    argument: '',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
  },
  triggers: [
    { label: 'order_rescheduled', value: 'order_rescheduled' },
    { label: 'workflows_internal', value: 'workflows_internal' },
  ],
  name: 'compare',
  friendlyName: 'Friendly name',
  description: '',
  important: false,
  multiSelectOption: [
    { label: 'auspost_job_updated', value: 'auspost_job_updated' },
    { label: 'create_collection_order', value: 'create_collection_order' },
    { label: 'create_delivery_route', value: 'create_delivery_route' },
  ],
  split: {
    input: {
      argument: '{{ .order.status }}',
      cases: [
        {
          value: 'PENDING',
          onMatch: { value: 'action-1', label: 'Action one' },
        },
      ],
    },
  },
  one: false,
  two: true,
  three: true,
  nextAction: { value: 'action-1', label: 'Action one' },
  onSuccess: { value: 'action-2', label: 'Action two' },
};

describe('format output', () => {
  it('should', () => {
    const result = formatOutput({
      values,
      schema,
    });

    expect(result.triggers).toEqual([
      'order_rescheduled',
      'workflows_internal',
    ]);

    expect(result.input.headers).toEqual([
      { key: 'Content-Type', value: 'application/json' },
    ]);

    expect(result.split.input.cases).toEqual([
      {
        value: 'PENDING',
        onMatch: 'action-1',
      },
    ]);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "description": "",
        "friendlyName": "Friendly name",
        "important": false,
        "input": Object {
          "argument": "",
          "comments": "",
          "conditionType": "is_equal",
          "headers": Array [
            Object {
              "key": "Content-Type",
              "value": "application/json",
            },
          ],
          "payloads": Object {
            "Hello": true,
          },
        },
        "multiSelectOption": Array [
          "auspost_job_updated",
          "create_collection_order",
          "create_delivery_route",
        ],
        "name": "compare",
        "nextAction": "action-1",
        "onSuccess": "action-2",
        "one": false,
        "split": Object {
          "input": Object {
            "argument": "{{ .order.status }}",
            "cases": Array [
              Object {
                "onMatch": "action-1",
                "value": "PENDING",
              },
            ],
          },
        },
        "three": true,
        "triggers": Array [
          "order_rescheduled",
          "workflows_internal",
        ],
        "two": true,
      }
    `);
  });
});
