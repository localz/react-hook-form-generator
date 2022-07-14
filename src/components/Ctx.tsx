import { createContext } from 'react';
import { SelectOptions } from '..';

export const Ctx = createContext<{
  isReadOnly: boolean;
  selectOptions: SelectOptions;
}>({
  isReadOnly: false,
  selectOptions: {},
});
