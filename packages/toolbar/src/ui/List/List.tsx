import { GridList as AriaGridList } from 'react-aria-components';
import type { GridListProps as AriaGridListProps } from 'react-aria-components';

import * as styles from './List.css';

interface ListProps<T extends object> extends AriaGridListProps<T> {
	// Allow either children or items + children render prop
}

/**
 * List component with built-in keyboard navigation support via React Aria Components.
 * Uses GridList under the hood for accessibility and keyboard navigation.
 */
export function List<T extends object>(props: ListProps<T>) {
	const { children, className, selectionMode = 'none', ...rest } = props;

	return (
		<AriaGridList
			{...rest}
			selectionMode={selectionMode}
			className={className || styles.list}
			aria-label={props['aria-label'] || 'List'}
		>
			{children}
		</AriaGridList>
	);
}
