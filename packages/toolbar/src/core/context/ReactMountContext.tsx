import { createContext, useContext } from 'react';

const ReactMountContext = createContext<HTMLElement>(document.createElement('div'));

export const useReactMount = () => {
  return useContext(ReactMountContext);
};

export default ReactMountContext;
