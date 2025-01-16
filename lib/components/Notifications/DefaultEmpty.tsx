import { Typography } from '@mui/material';
import { ReactNode } from 'react';

export const DefaultEmptyComponent: ReactNode = (
  <div
    style={{
      width: '100%',
      position: 'absolute',
      top: '50%',
      textAlign: 'center'
    }}
  >
    <Typography color="textSecondary">You are all caught up!</Typography>
  </div>
);
