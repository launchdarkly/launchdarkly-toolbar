import { style } from "@vanilla-extract/css";
import { Z_INDEX } from "../../constants/zIndex";

// Modal/Popup styles
export const modalOverlay = style({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: Z_INDEX.MODAL,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  });
  
  export const modalContent = style({
    backgroundColor: 'var(--lp-color-bg-ui-primary)',
    borderRadius: 'var(--lp-border-radius-large)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid var(--lp-color-border-ui-primary)',
    width: '90vw',
    height: '80vh',
    maxWidth: '1200px',
    maxHeight: '800px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  });
  
  export const modalHeader = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--lp-size-16)',
    borderBottom: '1px solid var(--lp-color-border-ui-primary)',
    backgroundColor: 'var(--lp-color-bg-ui-secondary)',
    borderTopLeftRadius: 'var(--lp-border-radius-large)',
    borderTopRightRadius: 'var(--lp-border-radius-large)',
  });
  
  export const modalTitle = style({
    font: 'var(--lp-text-heading-4-medium)',
    color: 'var(--lp-color-text-ui-primary)',
    margin: 0,
  });
  
  export const modalCloseButton = style({
    background: 'none',
    border: 'none',
    padding: 'var(--lp-size-8)',
    cursor: 'pointer',
    borderRadius: 'var(--lp-border-radius-medium)',
    color: 'var(--lp-color-text-ui-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: 'var(--lp-color-bg-ui-tertiary)',
      color: 'var(--lp-color-text-ui-primary)',
    },
    ':focus': {
      outline: 'none',
    },
    ':focus-visible': {
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '2px',
    },
  });
  
  export const iframeContainer = style({
    flex: 1,
    padding: 0,
    overflow: 'hidden',
  });
  
  export const modalIframe = style({
    width: '100%',
    height: '100%',
    border: 'none',
    borderBottomLeftRadius: 'var(--lp-border-radius-large)',
    borderBottomRightRadius: 'var(--lp-border-radius-large)',
  });