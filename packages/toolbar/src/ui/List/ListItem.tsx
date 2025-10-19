import { GridListItem as AriaGridListItem, composeRenderProps } from 'react-aria-components';
import type { GridListItemProps as AriaGridListItemProps } from 'react-aria-components';
import type { ReactNode } from 'react';

import * as styles from './List.css';

interface ListItemProps extends Omit<AriaGridListItemProps, 'children'> {
	children: ReactNode;
}

/**
 * ListItem component with keyboard navigation support.
 * Wraps React Aria's GridListItem for accessibility.
 */
export function ListItem(props: ListItemProps) {
	const { children, className, textValue, ...rest } = props;

	// Auto-generate textValue from children if it's a string
	const derivedTextValue = textValue || (typeof children === 'string' ? children : undefined);

	return (
		<AriaGridListItem
			{...rest}
			textValue={derivedTextValue}
			className={composeRenderProps(className, (providedClassName) => {
				// Always apply base styles, then merge with provided className
				return `${styles.listItem} ${providedClassName || ''}`.trim();
			})}
		>
			{children}
		</AriaGridListItem>
	);
}
