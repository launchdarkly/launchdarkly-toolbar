import { useMemo, useCallback, Dispatch, SetStateAction } from 'react';

import { ANIMATION_CONFIG, DIMENSIONS, SHADOWS } from '../constants';

export interface UseToolbarAnimationsProps {
  showFullToolbar: boolean;
  isHovered: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
}

export interface UseToolbarAnimationsReturn {
  containerAnimations: {
    width: number;
    height: string | number;
    borderRadius: number;
    scale: number;
    boxShadow: string;
  };
  animationConfig: typeof ANIMATION_CONFIG.container;
  handleAnimationStart: () => void;
  handleAnimationComplete: () => void;
}

export function useToolbarAnimations(props: UseToolbarAnimationsProps): UseToolbarAnimationsReturn {
  const { showFullToolbar, isHovered, setIsAnimating } = props;

  const containerAnimations = useMemo(
    () => ({
      width: showFullToolbar ? DIMENSIONS.expanded.width : DIMENSIONS.collapsed.width,
      height: showFullToolbar ? 'auto' : DIMENSIONS.collapsed.height,
      borderRadius: showFullToolbar ? DIMENSIONS.expanded.borderRadius : DIMENSIONS.collapsed.borderRadius,
      scale: showFullToolbar ? DIMENSIONS.scale.expanded : DIMENSIONS.scale.collapsed,
      boxShadow: showFullToolbar ? SHADOWS.expanded : isHovered ? SHADOWS.hoveredCollapsed : SHADOWS.collapsed,
    }),
    [showFullToolbar, isHovered],
  );

  const handleAnimationStart = useCallback(() => {
    setIsAnimating(true);
  }, [setIsAnimating]);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, [setIsAnimating]);

  return {
    containerAnimations,
    animationConfig: ANIMATION_CONFIG.container,
    handleAnimationStart,
    handleAnimationComplete,
  };
}
