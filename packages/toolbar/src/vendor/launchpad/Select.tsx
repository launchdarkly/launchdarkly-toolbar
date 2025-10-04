import type { Ref } from 'react';
import type {
  SelectProps as AriaSelectProps,
  SelectValueProps as AriaSelectValueProps,
  ContextValue,
} from 'react-aria-components';

import { cva, cx } from 'class-variance-authority';
import { createContext } from 'react';
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  composeRenderProps,
  Provider,
} from 'react-aria-components';

import { ButtonContext } from './Button';
import baseStyles from './styles/base.module.css';
import styles from './styles/Select.module.css';
import { useLPContextProps } from './utils';

const selectStyles = cva(styles.select);
const selectValueStyles = cva(styles.value);

interface SelectProps<T extends object> extends AriaSelectProps<T> {
  ref?: Ref<HTMLDivElement>;
}

interface SelectValueProps<T extends object> extends AriaSelectValueProps<T> {
  ref?: Ref<HTMLSpanElement>;
}

// biome-ignore lint/suspicious/noExplicitAny: ignore
const SelectContext = createContext<ContextValue<SelectProps<any>, HTMLDivElement>>(null);
const SelectValueContext =
  // biome-ignore lint/suspicious/noExplicitAny: ignore
  createContext<ContextValue<SelectValueProps<any>, HTMLSpanElement>>(null);

const Select = <T extends object>({ ref, ...props }: SelectProps<T>) => {
  [props, ref] = useLPContextProps(props, ref, SelectContext);
  return (
    <AriaSelect
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className, renderProps) =>
        selectStyles({ ...renderProps, className }),
      )}
    >
      {composeRenderProps(props.children, (children, { isInvalid }) => (
        <Provider
          values={[
            [
              ButtonContext,
              {
                className: cx(isInvalid && baseStyles.invalid),
                variant: 'picker',
                size: null,
              },
            ],
          ]}
        >
          {children}
        </Provider>
      ))}
    </AriaSelect>
  );
};

const SelectValue = <T extends object>({ ref, ...props }: SelectValueProps<T>) => {
  [props, ref] = useLPContextProps(props, ref, SelectValueContext);
  return (
    <AriaSelectValue
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className, renderProps) =>
        selectValueStyles({ ...renderProps, className }),
      )}
    />
  );
};

export { Select, SelectContext, SelectValue, SelectValueContext, selectStyles, selectValueStyles };
export type { SelectProps, SelectValueProps };
