import { ObjectFieldSchema, Schema } from '../types';

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

export function formatSelectOutput({
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

    if (!prop) {
      acc[name] = value;
      return acc;
    }

    if (prop.type === 'object') {
      acc[name] = formatSelectOutput({
        values: value,
        schema: prop.properties,
      });

      return acc;
    }

    if (prop.type === 'array' && prop.itemField.type === 'select') {
      acc[name] = value.map(formatSelect);
      return acc;
    }

    if (prop.type === 'array' && prop.itemField.type === 'object') {
      if (Array.isArray(value)) {
        acc[name] = value.map((v) => {
          return formatSelectOutput({
            values: v,
            schema: (prop.itemField as ObjectFieldSchema).properties,
          });
        });
        return acc;
      }

      acc[name] = formatSelectOutput({
        values: value,
        schema: prop.itemField.properties,
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
