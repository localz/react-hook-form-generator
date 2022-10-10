import get from 'lodash.get';

export const getIndex = (name: string): number | null => {
  const components = name.split('.');
  const len = components.length;
  if (len > 1) {
    // assuming this field isn't part of a nested object
    return parseInt(get(components[len - 2].split('['), '[1]'));
  }
  return null;
};
