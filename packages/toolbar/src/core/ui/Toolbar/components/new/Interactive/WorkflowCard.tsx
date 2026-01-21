import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Button, ButtonGroup } from '@launchpad-ui/components';
import { useElementSelection, useProjectContext } from '../../../context';
import { PreferredIde, loadPreferredIde, savePreferredIde } from '../../../utils/localStorage';
import { copyToClipboard } from '../../../utils/clipboard';
import { copyAndOpenInIde, IDE_CONFIGS } from './utils/ideLinks';
import { ChevronDownIcon, CursorIcon } from '../../icons';
import { getWorkflowConfig, type WorkflowType } from './workflowConfigs';
import * as styles from './WorkflowCard.module.css.ts';

// Copy icon
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// Check icon for success indicator
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WindsurfIcon = () => (
  <svg width="16" height="16" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M897.246 286.869H889.819C850.735 286.808 819.017 318.46 819.017 357.539V515.589C819.017 547.15 792.93 572.716 761.882 572.716C743.436 572.716 725.02 563.433 714.093 547.85L552.673 317.304C539.28 298.16 517.486 286.747 493.895 286.747C457.094 286.747 423.976 318.034 423.976 356.657V515.619C423.976 547.181 398.103 572.746 366.842 572.746C348.335 572.746 329.949 563.463 319.021 547.881L138.395 289.882C134.316 284.038 125.154 286.93 125.154 294.052V431.892C125.154 438.862 127.285 445.619 131.272 451.34L309.037 705.2C319.539 720.204 335.033 731.344 352.9 735.392C397.616 745.557 438.77 711.135 438.77 667.278V508.406C438.77 476.845 464.339 451.279 495.904 451.279H495.995C515.02 451.279 532.857 460.562 543.785 476.145L705.235 706.661C718.659 725.835 739.327 737.218 763.983 737.218C801.606 737.218 833.841 705.9 833.841 667.308V508.376C833.841 476.815 859.41 451.249 890.975 451.249H897.276C901.233 451.249 904.43 448.053 904.43 444.097V294.021C904.43 290.065 901.233 286.869 897.276 286.869H897.246Z"
      fill="currentColor"
    />
  </svg>
);

const VSCodeIcon = () => {
  const maskId = `vscode-mask-${Math.random().toString(36).substring(2, 11)}`;
  const filter0Id = `filter0-${Math.random().toString(36).substring(2, 11)}`;
  const filter1Id = `filter1-${Math.random().toString(36).substring(2, 11)}`;
  const gradientId = `paint0-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M70.9119 99.3171C72.4869 99.9307 74.2828 99.8914 75.8725 99.1264L96.4608 89.2197C98.6242 88.1787 100 85.9892 100 83.5872V16.4133C100 14.0113 98.6243 11.8218 96.4609 10.7808L75.8725 0.873756C73.7862 -0.130129 71.3446 0.11576 69.5135 1.44695C69.252 1.63711 69.0028 1.84943 68.769 2.08341L29.3551 38.0415L12.1872 25.0096C10.589 23.7965 8.35363 23.8959 6.86933 25.2461L1.36303 30.2549C-0.452552 31.9064 -0.454633 34.7627 1.35853 36.417L16.2471 50.0001L1.35853 63.5832C-0.454633 65.2374 -0.452552 68.0938 1.36303 69.7453L6.86933 74.7541C8.35363 76.1043 10.589 76.2037 12.1872 74.9905L29.3551 61.9587L68.769 97.9167C69.3925 98.5406 70.1246 99.0104 70.9119 99.3171ZM75.0152 27.2989L45.1091 50.0001L75.0152 72.7012V27.2989Z"
          fill="white"
        />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          d="M96.4614 10.7962L75.8569 0.875542C73.4719 -0.272773 70.6217 0.211611 68.75 2.08333L1.29858 63.5832C-0.515693 65.2373 -0.513607 68.0937 1.30308 69.7452L6.81272 74.754C8.29793 76.1042 10.5347 76.2036 12.1338 74.9905L93.3609 13.3699C96.086 11.3026 100 13.2462 100 16.6667V16.4275C100 14.0265 98.6246 11.8378 96.4614 10.7962Z"
          fill="#0065A9"
        />
        <g filter={`url(#${filter0Id})`}>
          <path
            d="M96.4614 89.2038L75.8569 99.1245C73.4719 100.273 70.6217 99.7884 68.75 97.9167L1.29858 36.4169C-0.515693 34.7627 -0.513607 31.9063 1.30308 30.2548L6.81272 25.246C8.29793 23.8958 10.5347 23.7964 12.1338 25.0095L93.3609 86.6301C96.086 88.6974 100 86.7538 100 83.3334V83.5726C100 85.9735 98.6246 88.1622 96.4614 89.2038Z"
            fill="#007ACC"
          />
        </g>
        <g filter={`url(#${filter1Id})`}>
          <path
            d="M75.8578 99.1263C73.4721 100.274 70.6219 99.7885 68.75 97.9166C71.0564 100.223 75 98.5895 75 95.3278V4.67213C75 1.41039 71.0564 -0.223106 68.75 2.08329C70.6219 0.211402 73.4721 -0.273666 75.8578 0.873633L96.4587 10.7807C98.6234 11.8217 100 14.0112 100 16.4132V83.5871C100 85.9891 98.6234 88.1786 96.4586 89.2196L75.8578 99.1263Z"
            fill="#1F9CF0"
          />
        </g>
        <g style={{ mixBlendMode: 'overlay' }} opacity={0.25}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M70.8511 99.3171C72.4261 99.9306 74.2221 99.8913 75.8117 99.1264L96.4 89.2197C98.5634 88.1787 99.9392 85.9892 99.9392 83.5871V16.4133C99.9392 14.0112 98.5635 11.8217 96.4001 10.7807L75.8117 0.873695C73.7255 -0.13019 71.2838 0.115699 69.4527 1.44688C69.1912 1.63705 68.942 1.84937 68.7082 2.08335L29.2943 38.0414L12.1264 25.0096C10.5283 23.7964 8.29285 23.8959 6.80855 25.246L1.30225 30.2548C-0.513334 31.9064 -0.515415 34.7627 1.29775 36.4169L16.1863 50L1.29775 63.5832C-0.515415 65.2374 -0.513334 68.0937 1.30225 69.7452L6.80855 74.754C8.29285 76.1042 10.5283 76.2036 12.1264 74.9905L29.2943 61.9586L68.7082 97.9167C69.3317 98.5405 70.0638 99.0104 70.8511 99.3171ZM74.9544 27.2989L45.0483 50L74.9544 72.7012V27.2989Z"
            fill={`url(#${gradientId})`}
          />
        </g>
      </g>
      <defs>
        <filter
          id={filter0Id}
          x="-8.39411"
          y="15.8291"
          width="116.727"
          height="92.2456"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="4.16667" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter
          id={filter1Id}
          x="60.4167"
          y="-8.07558"
          width="47.9167"
          height="116.151"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="4.16667" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient
          id={gradientId}
          x1="49.9392"
          y1="0.257812"
          x2="49.9392"
          y2="99.7423"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const GitHubCopilotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 96 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M95.667 67.954C92.225 73.933 72.24 88.04 47.997 88.04 23.754 88.04 3.769 73.933.328 67.954c-.216-.375-.307-.796-.328-1.226V55.661c.019-.371.089-.736.226-1.081 1.489-3.738 5.386-9.166 10.417-10.623.667-1.712 1.655-4.215 2.576-6.062-.154-1.414-.208-2.872-.208-4.345 0-5.322 1.128-9.99 4.527-13.466 1.587-1.623 3.557-2.869 5.893-3.805 5.595-4.545 13.563-8.369 24.48-8.369s19.057 3.824 24.652 8.369c2.337.936 4.306 2.182 5.894 3.805 3.399 3.476 4.527 8.144 4.527 13.466 0 1.473-.054 2.931-.208 4.345.921 1.847 1.909 4.35 2.576 6.062 5.03 1.457 8.928 6.885 10.417 10.623.163.41.231.848.231 1.289v10.644c0 .504-.081 1.004-.333 1.441ZM48.686 43.993l-.3.001-1.077-.001c-.423.709-.894 1.39-1.418 2.035-3.078 3.787-7.672 5.964-14.026 5.964-6.897 0-11.952-1.435-15.123-5.032a7.886 7.886 0 0 1-.342-.419l-.39.419v26.326c5.737 3.118 18.05 8.713 31.987 8.713 13.938 0 26.251-5.595 31.988-8.713V46.96l-.39-.419s-.132.181-.342.419c-3.171 3.597-8.226 5.032-15.123 5.032-6.354 0-10.949-2.177-14.026-5.964a17.178 17.178 0 0 1-1.418-2.034h-.066l.066-.001Zm-3.94-11.733c.17-1.326.251-2.513.253-3.573v-.084c-.005-3.077-.678-5.079-1.752-6.308-1.365-1.562-4.184-2.758-10.127-2.115-6.021.652-9.386 2.146-11.294 4.098-1.847 1.889-2.818 4.715-2.818 9.272 0 4.842.698 7.703 2.232 9.443 1.459 1.655 4.332 3.001 10.625 3.001 4.837 0 7.603-1.573 9.371-3.749 1.899-2.336 2.967-5.759 3.51-9.985Zm6.503 0c.543 4.226 1.611 7.649 3.51 9.985 1.768 2.176 4.533 3.749 9.371 3.749 6.292 0 9.165-1.346 10.624-3.001 1.535-1.74 2.232-4.601 2.232-9.443 0-4.557-.97-7.383-2.817-9.272-1.908-1.952-5.274-3.446-11.294-4.098-5.943-.643-8.763.553-10.127 2.115-1.074 1.229-1.747 3.231-1.752 6.308v.084c.002 1.06.083 2.247.253 3.573Zm-2.563 11.734h.066l-.066-.001v.001Z" />
    <path d="M38.5 55.75a3.5 3.5 0 0 1 3.5 3.5v8.5a3.5 3.5 0 1 1-7 0v-8.5a3.5 3.5 0 0 1 3.5-3.5Zm19 0a3.5 3.5 0 0 1 3.5 3.5v8.5a3.5 3.5 0 1 1-7 0v-8.5a3.5 3.5 0 0 1 3.5-3.5Z" />
  </svg>
);

const IdeIcon = ({ ide }: { ide: PreferredIde }) => {
  switch (ide) {
    case 'cursor':
      return <CursorIcon />;
    case 'windsurf':
      return <WindsurfIcon />;
    case 'vscode':
      return <VSCodeIcon />;
    case 'github-copilot':
      return <GitHubCopilotIcon />;
  }
};

/**
 * Props for the WorkflowCard component.
 * A workflow card allows users to generate AI prompts for common development tasks
 * like wrapping elements in feature flags or adding click tracking.
 */
export interface WorkflowCardProps {
  /** The type of workflow this card represents */
  workflow: WorkflowType;
  /** Whether the workflow card is disabled (shows "Coming Soon" badge) */
  disabled?: boolean;
}

export function WorkflowCard({ workflow, disabled = false }: WorkflowCardProps) {
  // Get workflow configuration from registry
  const config = getWorkflowConfig(workflow);

  // Pull data from context - the component owns its data dependencies
  const { selectedElementInfo } = useElementSelection();
  const { projectKey } = useProjectContext();

  const [preferredIde, setPreferredIde] = useState<PreferredIde>(() => loadPreferredIde());
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const isTogglingRef = useRef(false);
  const copySuccessTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prompt = useMemo(() => {
    if (!selectedElementInfo) return '';
    return config.buildPrompt(selectedElementInfo, projectKey || 'default', inputValue);
  }, [config, selectedElementInfo, projectKey, inputValue]);

  const condensedPrompt = useMemo(() => {
    if (!selectedElementInfo || !config.buildCondensedPrompt) return undefined;
    return config.buildCondensedPrompt(selectedElementInfo, projectKey || 'default', inputValue);
  }, [config, selectedElementInfo, projectKey, inputValue]);

  const isActionEnabled = inputValue.trim().length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if we're currently toggling (opening the dropdown)
      if (isTogglingRef.current) return;

      const target = event.target as Node;
      if (!dropdownRef.current) return;

      // Check if click is outside the dropdown container
      // The container includes both the button group and the dropdown menu
      if (!dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copySuccessTimeoutRef.current) {
        clearTimeout(copySuccessTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyOnly = useCallback(async () => {
    if (!isActionEnabled) return;
    setIsDropdownOpen(false);
    const success = await copyToClipboard(prompt);
    if (success) {
      // Clear any existing timeout
      if (copySuccessTimeoutRef.current) {
        clearTimeout(copySuccessTimeoutRef.current);
      }
      // Show success indicator
      setShowCopySuccess(true);
      // Hide after 2 seconds
      copySuccessTimeoutRef.current = setTimeout(() => {
        setShowCopySuccess(false);
      }, 2000);
    }
  }, [prompt, isActionEnabled]);

  const handleOpenInIde = useCallback(
    async (ide: PreferredIde) => {
      if (!isActionEnabled) return;
      // Always update preferred IDE when selecting from dropdown
      // Update state first - this will trigger a re-render
      setPreferredIde(ide);
      savePreferredIde(ide);
      setIsDropdownOpen(false);
      await copyAndOpenInIde(prompt, ide, condensedPrompt);
    },
    [prompt, condensedPrompt, isActionEnabled],
  );

  const toggleDropdown = useCallback(() => {
    if (!isActionEnabled) return;
    isTogglingRef.current = true;
    setIsDropdownOpen((prev) => !prev);
    // Reset the flag after the next frame for more reliable timing
    requestAnimationFrame(() => {
      isTogglingRef.current = false;
    });
  }, [isActionEnabled]);

  // Compute IDE label - this will update when preferredIde changes
  const currentIdeLabel = IDE_CONFIGS.find((c) => c.id === preferredIde)?.label || preferredIde;

  // Set title attribute on button element for tooltip
  useEffect(() => {
    if (buttonWrapperRef.current) {
      const buttonElement = buttonWrapperRef.current.querySelector('button');
      if (buttonElement) {
        // Cursor and GitHub Copilot receive the prompt directly via URL
        const tooltip =
          preferredIde === 'cursor' || preferredIde === 'github-copilot'
            ? `Open in ${currentIdeLabel}`
            : `Copy prompt and open in ${currentIdeLabel}`;
        buttonElement.title = tooltip;
      }
    }
  }, [currentIdeLabel, preferredIde]);

  // Disabled card - simplified view
  if (disabled) {
    return (
      <div className={styles.card} data-disabled="true">
        <div className={styles.cardHeader}>
          <div className={styles.iconContainer}>{config.icon}</div>
          <div className={styles.cardContent}>
            <h4 className={styles.title}>
              {config.title}
              <span className={styles.comingSoonBadge}>Coming Soon</span>
            </h4>
            <p className={styles.description}>{config.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>{config.icon}</div>
        <div className={styles.cardContent}>
          <h4 className={styles.title}>{config.title}</h4>
          <p className={styles.description}>{config.description}</p>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>{config.inputLabel}</label>
        <input
          type="text"
          className={styles.input}
          placeholder={config.inputPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            // Stop propagation to prevent parent app keyboard shortcuts from interfering
            e.stopPropagation();
          }}
          onKeyUp={(e) => e.stopPropagation()}
          onKeyPress={(e) => e.stopPropagation()}
        />
      </div>

      <div className={`${styles.actions} ${!isActionEnabled ? styles.actionsDisabled : ''}`}>
        <div className={styles.splitButtonContainer} ref={dropdownRef}>
          <ButtonGroup spacing="compact" className={styles.splitButtonGroup}>
            <div ref={buttonWrapperRef} style={{ display: 'inline-flex' }}>
              <Button
                key={`ide-button-${preferredIde}`}
                className={styles.splitButtonMain}
                onPress={() => handleOpenInIde(preferredIde)}
                isDisabled={!isActionEnabled}
              >
                <span>
                  {preferredIde === 'cursor' || preferredIde === 'github-copilot'
                    ? 'Open in '
                    : 'Copy prompt and Open in '}
                </span>
                <IdeIcon ide={preferredIde} />
              </Button>
            </div>
            <button
              aria-label="Choose IDE"
              className={`${styles.splitButtonDropdown} ${isDropdownOpen ? styles.splitButtonDropdownOpen : ''} ${showCopySuccess ? styles.splitButtonDropdownSuccess : ''}`}
              disabled={!isActionEnabled}
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              type="button"
            >
              {showCopySuccess ? <CheckIcon /> : <ChevronDownIcon />}
            </button>
          </ButtonGroup>

          {isDropdownOpen ? (
            <div className={styles.dropdownMenu} role="listbox">
              {IDE_CONFIGS.map((ide) => (
                <button
                  key={ide.id}
                  className={`${styles.dropdownItem} ${ide.id === preferredIde ? styles.dropdownItemSelected : ''}`}
                  onClick={() => handleOpenInIde(ide.id)}
                  role="option"
                  aria-selected={ide.id === preferredIde}
                >
                  <IdeIcon ide={ide.id} />
                  <span>{ide.label}</span>
                  {ide.id === preferredIde ? <span className={styles.preferredBadge}>Default</span> : null}
                </button>
              ))}
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} onClick={handleCopyOnly} role="option">
                <CopyIcon />
                <span>Copy prompt</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
