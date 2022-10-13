import { formatSelectInput } from '../formatSelectInput';
import {
  schema,
  defaultValues,
  selectOptions,
} from '../../stories/data/workflows';

describe('format input', () => {
  it('should format input', () => {
    const result = formatSelectInput({
      defaultValues,
      schema,
      selectOptions,
    });

    expect(result.triggersWithSelectKey).toEqual([
      { label: 'auspost_job_updated', value: 'auspost_job_updated' },
      { label: 'auspost_route_created', value: 'auspost_route_created' },
    ]);

    expect(result.input.conditionType).toEqual({
      label: 'is_greater_than',
      value: 'is_greater_than',
    });
    expect(result.input.conditionTypeWithSelectKey).toEqual([
      {
        value: 'action-2',
        label: 'Action two',
      },
      {
        value: 'action-1',
        label: 'Action one',
      },
    ]);

    expect(result.triggers).toEqual([
      {
        label: 'order_rescheduled',
        value: 'order_rescheduled',
      },
      {
        label: 'workflows_internal',
        value: 'workflows_internal',
      },
    ]);

    expect(result.nextAction).toEqual([
      {
        value: 'next_action_one',
        label: 'Next action one',
      },
      {
        value: 'next_action_two',
        label: 'Next action two',
      },
    ]);
  });
});
