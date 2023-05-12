import * as React from 'react';
import { createContext } from 'react';

export const initialValue = {
  token: '',
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
