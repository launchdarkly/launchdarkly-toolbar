export declare const EASING: {
    readonly bounce: readonly [0.34, 1.56, 0.64, 1];
    readonly smooth: readonly [0.25, 0.46, 0.45, 0.94];
    readonly elastic: readonly [0.22, 1, 0.36, 1];
};
export declare const ANIMATION_CONFIG: {
    readonly container: {
        readonly width: {
            readonly duration: 0.5;
            readonly ease: readonly [0.34, 1.56, 0.64, 1];
        };
        readonly height: {
            readonly duration: 0.5;
            readonly ease: readonly [0.34, 1.56, 0.64, 1];
        };
        readonly borderRadius: {
            readonly duration: 0.4;
            readonly ease: readonly [0.25, 0.46, 0.45, 0.94];
        };
        readonly boxShadow: {
            readonly duration: 0.3;
            readonly ease: "easeInOut";
        };
    };
    readonly circleLogo: {
        readonly opacity: {
            readonly duration: 0.25;
            readonly ease: "easeOut";
        };
        readonly scale: {
            readonly duration: 0.3;
            readonly ease: readonly [0.25, 0.46, 0.45, 0.94];
        };
        readonly rotate: {
            readonly duration: 0.3;
            readonly ease: readonly [0.25, 0.46, 0.45, 0.94];
        };
    };
    readonly toolbarContent: {
        readonly opacity: {
            readonly duration: 0.4;
            readonly ease: readonly [0.25, 0.46, 0.45, 0.94];
        };
        readonly y: {
            readonly duration: 0.5;
            readonly ease: readonly [0.34, 1.56, 0.64, 1];
        };
        readonly scale: {
            readonly duration: 0.5;
            readonly ease: readonly [0.34, 1.56, 0.64, 1];
        };
    };
    readonly contentArea: {
        readonly opacity: {
            readonly duration: 0.4;
            readonly ease: "easeInOut";
        };
        readonly maxHeight: {
            readonly duration: 0.5;
            readonly ease: readonly [0.22, 1, 0.36, 1];
        };
    };
    readonly tabContent: {
        readonly duration: 0.3;
        readonly ease: readonly [0.25, 0.46, 0.45, 0.94];
    };
    readonly tabsContainer: {
        readonly opacity: {
            readonly duration: 0.5;
            readonly ease: readonly [0.34, 1.56, 0.64, 1];
        };
        readonly y: {
            readonly duration: 0.5;
            readonly ease: readonly [0.34, 1.56, 0.64, 1];
        };
        readonly delay: 0.3;
    };
};
export declare const DIMENSIONS: {
    readonly collapsed: {
        readonly width: 60;
        readonly height: 60;
        readonly borderRadius: 30;
    };
    readonly expanded: {
        readonly width: 400;
        readonly borderRadius: 12;
    };
    readonly scale: {
        readonly expanded: 1.02;
        readonly collapsed: 1;
    };
    readonly slideDistance: 30;
};
export declare const SHADOWS: {
    readonly expanded: "0 12px 48px rgba(0, 0, 0, 0.5)";
    readonly hoveredCollapsed: "0 8px 40px rgba(0, 0, 0, 0.4)";
    readonly collapsed: "0 4px 16px rgba(0, 0, 0, 0.3)";
};
