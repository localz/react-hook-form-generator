import { formatSelectOutput } from '../formatSelectOutput';

import { schema } from '../../stories/data/workflows';

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
    const result = formatSelectOutput({
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
