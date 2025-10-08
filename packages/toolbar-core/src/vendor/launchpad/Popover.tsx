import type { VariantProps } from 'class-variance-authority';
import type { Ref } from 'react';
import type { PopoverProps as AriaPopoverProps, ContextValue } from 'react-aria-components';

import { cva } from 'class-variance-authority';
import { createContext } from 'react';
import { Popover as AriaPopover, composeRenderProps } from 'react-aria-components';

import styles from './styles/Popover.module.css';
import { useLPContextProps } from './utils';

interface PopoverProps extends AriaPopoverProps, VariantProps<typeof popoverStyles> {
  ref?: Ref<HTMLElement>;
}

const PopoverContext = createContext<ContextValue<PopoverProps, HTMLElement>>(null);

const popoverStyles = cva(styles.popover, {
  variants: {
    width: {
      default: styles.default,
      trigger: styles.trigger,
    },
  },
  defaultVariants: {
    width: 'default',
  },
});

const Popover = ({ ref, ...props }: PopoverProps) => {
  [props, ref] = useLPContextProps(props, ref, PopoverContext);
  const { offset = 4, crossOffset = 0, width = 'default' } = props;

  return (
    <AriaPopover
      offset={offset}
      crossOffset={crossOffset}
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className, renderProps) =>
        popoverStyles({ ...renderProps, width, className }),
      )}
    />
  );
};

export { Popover, PopoverContext, popoverStyles };
export type { PopoverProps };
