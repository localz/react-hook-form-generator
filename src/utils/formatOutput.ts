import { Schema } from '../types';

function formatSelect(
  value:
    | undefined
    | { value: string; label: string }
    | { value: string; label: string }[]
) {
  if (Array.isArray(value)) {
    return value.map((v) => v.value);
  }

  if (value?.value) {
    return value.value;
  }

  return value;
}

export function formatOutput({
  values,
  schema,
}: {
  values: Object;
  schema: Schema;
}) {
  const entries = Object.entries(values);

  const res = entries.reduce((acc, curr) => {
    const [name, value] = curr;

    const prop = schema[name];

    if (prop.type === 'object') {
      acc[name] = formatOutput({
        values: value,
        schema: prop.properties,
      });

      return acc;
    }

    if (prop.type === 'select') {
      acc[name] = formatSelect(value);
      return acc;
    }

    acc[name] = value;

    return acc;
  }, {} as Record<string, any>);

  return res;
}
