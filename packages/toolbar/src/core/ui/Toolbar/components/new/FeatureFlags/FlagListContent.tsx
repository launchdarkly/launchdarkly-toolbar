import { FlagList } from './FlagList';

/**
 * Not wrapped in `memo`: nested `FlagList` subscribes to `ToolbarState` (e.g. lifecycle filter toggles).
 * A memo boundary with no props can prevent that subtree from reconciling when only toolbar state changes,
 * so the stats line would stay stale until another context (e.g. tab search) updated.
 */
export function FlagListContent() {
  return <FlagList />;
}
