import { Dispatch, SetStateAction } from 'react';
import { ANIMATION_CONFIG } from '../constants';
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
export declare function useToolbarAnimations(props: UseToolbarAnimationsProps): UseToolbarAnimationsReturn;
