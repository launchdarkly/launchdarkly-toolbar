import { style } from "@vanilla-extract/css";

export const listItemColumn = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const listItemRow = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const flagHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
  maxWidth: 'calc(100% - 90px)',
});

export const flagNameText = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
