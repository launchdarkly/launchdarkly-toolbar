import { useMemo, useCallback, useRef, Dispatch, SetStateAction } from 'react';

import { ANIMATION_CONFIG, DIMENSIONS, SHADOWS } from '../constants';

export interface UseToolbarAnimationsProps {
  isExpanded: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  onExpandComplete?: () => void;
  onCollapseComplete?: () => void;
}

type AnimationConfig = typeof ANIMATION_CONFIG.containerExpand | typeof ANIMATION_CONFIG.containerCollapse;

export interface UseToolbarAnimationsReturn {
  containerAnimations: {
    width: number;
    height: string | number;
    borderRadius: number;
    scale: number;
    boxShadow: string;
  };
  animationConfig: AnimationConfig;
  handleAnimationStart: () => void;
  handleAnimationComplete: () => void;
}

export function useToolbarAnimations(props: UseToolbarAnimationsProps): UseToolbarAnimationsReturn {
  const { isExpanded, setIsAnimating, onExpandComplete, onCollapseComplete } = props;
  const previousIsExpanded = useRef(isExpanded);

  const containerAnimations = useMemo(
    () => ({
      width: isExpanded ? DIMENSIONS.expanded.width : DIMENSIONS.collapsed.width,
      height: isExpanded ? 'fit-content' : DIMENSIONS.collapsed.height,
      borderRadius: isExpanded ? DIMENSIONS.expanded.borderRadius : DIMENSIONS.collapsed.borderRadius,
      scale: isExpanded ? DIMENSIONS.scale.expanded : DIMENSIONS.scale.collapsed,
      boxShadow: isExpanded ? SHADOWS.expanded : SHADOWS.collapsed,
    }),
    [isExpanded],
  );

  // Determine animation direction and apply appropriate easing
  // - Expanding: smooth animation for professional feel
  // - Collapsing: bouncy animation for playful feedback
  const animationConfig = useMemo(() => {
    const wasExpanded = previousIsExpanded.current;
    const currentlyExpanded = isExpanded;

    // Update the ref for next comparison
    previousIsExpanded.current = isExpanded;

    // Expanding: collapsed → expanded (smooth)
    if (!wasExpanded && currentlyExpanded) {
      return ANIMATION_CONFIG.containerExpand;
    }
    // Collapsing: expanded → collapsed (bouncy)
    else if (wasExpanded && !currentlyExpanded) {
      return ANIMATION_CONFIG.containerCollapse;
    }
    // No state change or initial render (default to smooth)
    else {
      return ANIMATION_CONFIG.containerExpand;
    }
  }, [isExpanded]);

  const handleAnimationStart = useCallback(() => {
    setIsAnimating(true);
  }, [setIsAnimating]);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
    if (isExpanded && onExpandComplete) {
      onExpandComplete();
    } else if (!isExpanded && onCollapseComplete) {
      onCollapseComplete();
    }
  }, [setIsAnimating, isExpanded, onExpandComplete, onCollapseComplete]);

  return {
    containerAnimations,
    animationConfig,
    handleAnimationStart,
    handleAnimationComplete,
  };
}
