import React from 'react';
import { ToolbarPosition, TOOLBAR_POSITIONS } from '../../../types/toolbar';
import { Select, SelectOption } from '../../../../Select/Select';
import { useToolbarUIContext } from '../../../context/ToolbarUIProvider';
import { useAnalytics } from '../../../context/AnalyticsProvider';

interface PositionSelectorProps {
  currentPosition: ToolbarPosition;
}

export const PositionSelector: React.FC<PositionSelectorProps> = ({ currentPosition }) => {
  const { handlePositionChange } = useToolbarUIContext();
  const analytics = useAnalytics();

  const getDisplayName = (position: ToolbarPosition): string => {
    return position
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const handlePositionSelect = (key: string | null) => {
    if (key && key !== currentPosition) {
      const newPosition = key as ToolbarPosition;
      analytics.trackPositionChange(currentPosition, newPosition, 'settings');
      handlePositionChange(newPosition);
    }
  };

  const options: SelectOption[] = TOOLBAR_POSITIONS.map((position) => ({
    id: position,
    label: getDisplayName(position),
  }));

  return (
    <Select
      selectedKey={currentPosition}
      onSelectionChange={handlePositionSelect}
      aria-label="Select toolbar position"
      placeholder="Select position"
      data-theme="dark"
      options={options}
    />
  );
};
