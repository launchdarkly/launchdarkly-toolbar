import { style } from '@vanilla-extract/css';

export const jsonTextarea = style({
  width: '100%',
  fontFamily: 'monospace',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '8px',
  backgroundColor: '#2a2a2a',
  color: '#fff',
});

export const jsonTextareaError = style({
  border: '1px solid red',
});

export const jsonButtonGroup = style({
  display: 'flex',
  gap: '4px',
  marginTop: '4px',
});

export const jsonParseError = style({
  color: 'red',
  fontSize: '12px',
  marginTop: '4px',
});

export const editActionsContainer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '4px',
  marginTop: '4px',
});
