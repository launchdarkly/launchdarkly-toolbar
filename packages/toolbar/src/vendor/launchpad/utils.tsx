import type { Context, Ref } from 'react';
import type { ContextValue, SlotProps } from 'react-aria-components';

import { mergeRefs } from '@react-aria/utils';
import { useMemo } from 'react';
import { mergeProps } from 'react-aria';
import { useSlottedContext } from 'react-aria-components';

const useLPContextProps = <T, U extends SlotProps, E>(
  props: T & SlotProps,
  ref: Ref<E> | undefined,
  context: Context<ContextValue<U, E>>,
): [T, Ref<E | null>] => {
  const ctx = useSlottedContext(context, props.slot) || {};
  // @ts-expect-error
  const { ref: contextRef, ...contextProps } = ctx;
  const mergedRef = useMemo(() => mergeRefs(ref, contextRef), [ref, contextRef]);
  const mergedProps = mergeProps(contextProps, props) as unknown as T;

  return [mergedProps, mergedRef];
};

export { useLPContextProps };
