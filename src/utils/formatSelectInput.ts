import { FormProps } from 'components/Form';
import { Field, SelectOptions } from '../types';

function getOptions({
  field,
  selectOptions,
}: {
  field: Field;
  selectOptions: SelectOptions;
}) {
  if (field.type !== 'select') {
    return [];
  }

  if (field.options) {
    return field.options;
  }

  if (field.selectKey) {
    return selectOptions[field.selectKey].options;
  }

  return [];
}

function formatSelect({
  value,
  options,
}: {
  value:
    | undefined
    | { value: string; label: string }
    | { value: string; label: string }[];
  options: ReturnType<typeof getOptions>;
}) {
  if (!options || !Array.isArray(options)) {
    return value;
  }

  if (typeof value === 'string') {
    return options.find((o) => o.value === value);
  }

  if (Array.isArray(value)) {
    return value.map((v) => {
      if (typeof v === 'string') {
        return options.find((o) => o.value === v);
      }
      if (v.value) {
        return options.find((o) => o.value === v.value);
      }
      return v;
    });
  }

  return value;
}

export function formatSelectInput({
  defaultValues,
  schema,
  selectOptions,
}: {
  defaultValues: any;
  schema: FormProps['schema'];
  selectOptions: SelectOptions;
}) {
  const entries = Object.entries(defaultValues);

  const res = entries.reduce((acc, curr) => {
    const [name, value] = curr as [string, any];

    const prop = schema[name];

    if (!prop) {
      console.warn(
        `${name} has no field in the schema. Check that your schema is correct and the default values match that schema.`
      );
      return acc;
    }

    if (prop.type === 'object') {
      acc[name] = formatSelectInput({
        defaultValues: value,
        schema: prop.properties,
        selectOptions,
      });

      return acc;
    }

    if (prop.type === 'array' && prop.itemField.type === 'select') {
      acc[name] = value.map((value: any) => {
        const options = getOptions({
          field: prop.itemField,
          selectOptions,
        });

        return formatSelect({
          value,
          options,
        });
      });
      return acc;
    }

    if (prop.type === 'array' && prop.itemField.type === 'object') {
      acc[name] = formatSelectInput({
        defaultValues: value,
        schema: prop.itemField.properties,
        selectOptions,
      });
      return acc;
    }

    if (prop.type === 'select') {
      acc[name] = formatSelect({
        value,
        options: getOptions({
          field: prop,
          selectOptions,
        }),
        // @ts-ignore
        schema: prop,
      });
      return acc;
    }

    acc[name] = value;

    return acc;
  }, {} as Record<string, any>);

  return res;
}
