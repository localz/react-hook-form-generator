import { formatResults } from '../formatOutput';
import { Schema } from '../../types';

const schema: Schema = {
  input: {
    type: 'object',
    label: 'Parent object',
    properties: {
      nestedSelect: {
        placeholder: 'Select option...',
        label: 'Nested select',
        type: 'select',
        selectKey: 'actionOptions',
      },
    },
  },

  fromContext: {
    placeholder: 'Select option...',
    label: 'From context',
    type: 'select',
    selectKey: 'actionOptions',
  },
  multiSelect: {
    placeholder: 'Select option...',
    label: 'Multi select',
    type: 'select',
    selectKey: 'actionOptions',
    isMulti: true,
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
  },
};

const values = {
  fromContext: { value: 'action-1', label: 'Action one' },
  input: { nestedSelect: { value: 'action-1', label: 'Action one' } },
  multiSelect: [
    { value: 'action-1', label: 'Action one' },
    { value: 'action-2', label: 'Action two' },
  ],
  stickyHeader: { label: 'Child 0', value: 'child-0-0' },
  customLabel: [
    { label: 'Child 3', value: 'child-0-3' },
    { label: 'Child 3', value: 'child-4-3' },
  ],
};

describe('formatResults', () => {
  it('should', () => {
    const result = formatResults({
      values,
      schema,
    });

    console.log('result', result);
  });
});
