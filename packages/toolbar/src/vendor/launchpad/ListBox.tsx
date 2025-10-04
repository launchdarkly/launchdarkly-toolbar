import type { Ref } from 'react';
import type {
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ContextValue,
} from 'react-aria-components';

import { cva } from 'class-variance-authority';
import { createContext } from 'react';
import { ListBox as AriaListBox, ListBoxItem as AriaListBoxItem, composeRenderProps } from 'react-aria-components';

import styles from './styles/ListBox.module.css';
import { useLPContextProps } from './utils';

const listBoxStyles = cva(styles.box);
const listBoxItemStyles = cva(styles.item);

interface ListBoxProps<T> extends AriaListBoxProps<T> {
  ref?: Ref<HTMLDivElement>;
}
interface ListBoxItemProps<T> extends AriaListBoxItemProps<T> {
  ref?: Ref<T>;
}

// biome-ignore lint/suspicious/noExplicitAny: ignore
const ListBoxContext = createContext<ContextValue<ListBoxProps<any>, HTMLDivElement>>(null);

const ListBox = <T extends object>({ ref, ...props }: ListBoxProps<T>) => {
  [props, ref] = useLPContextProps(props, ref, ListBoxContext);
  return (
    <AriaListBox
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className, renderProps) =>
        listBoxStyles({ ...renderProps, className }),
      )}
    />
  );
};

const ListBoxItem = <T extends object>({ ref, ...props }: ListBoxItemProps<T>) => {
  const textValue = props.textValue || (typeof props.children === 'string' ? props.children : undefined);
  return (
    <AriaListBoxItem
      textValue={textValue}
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className, renderProps) =>
        listBoxItemStyles({ ...renderProps, className }),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          <span className={styles.content}>{children}</span>
        </>
      ))}
    </AriaListBoxItem>
  );
};

export { ListBox, ListBoxContext, ListBoxItem, listBoxItemStyles, listBoxStyles };
export type { ListBoxProps, ListBoxItemProps };
