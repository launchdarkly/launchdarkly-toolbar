import { style } from '@vanilla-extract/css';

export const container = style({
  padding: '20px',
  color: '#ffffff',
});

export const header = style({
  marginBottom: '20px',
});

export const title = style({
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
  color: '#ffffff',
});

export const statusIndicator = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const statusDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
});

export const statusText = style({
  fontSize: '14px',
  color: '#d1d5db',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const message = style({
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#d1d5db',
  margin: 0,
});

export const authButton = style({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 24px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
  
  ':active': {
    transform: 'translateY(0)',
  },
  
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
});

export const infoBox = style({
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '8px',
});

export const infoText = style({
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#93c5fd',
  margin: '0 0 8px 0',
  
  ':last-child': {
    marginBottom: 0,
  },
});

export const codeStyle = style({
  background: 'rgba(255, 255, 255, 0.1)',
  padding: '2px 4px',
  borderRadius: '4px',
  fontSize: '12px',
  fontFamily: 'monospace',
});