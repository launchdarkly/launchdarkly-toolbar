import { EnhancedFlag } from '../../../types/devServer';
interface BooleanFlagControlProps {
    flag: EnhancedFlag;
    onOverride: (value: boolean) => void;
    disabled?: boolean;
}
export declare function BooleanFlagControl(props: BooleanFlagControlProps): import("react/jsx-runtime").JSX.Element;
interface MultivariateFlagControlProps {
    flag: EnhancedFlag;
    onOverride: (value: any) => void;
    disabled?: boolean;
}
export declare function MultivariateFlagControl(props: MultivariateFlagControlProps): import("react/jsx-runtime").JSX.Element;
interface StringNumberFlagControlProps {
    flag: EnhancedFlag;
    onOverride: (value: string | number) => void;
    disabled?: boolean;
}
export declare function StringNumberFlagControl(props: StringNumberFlagControlProps): import("react/jsx-runtime").JSX.Element;
export {};
