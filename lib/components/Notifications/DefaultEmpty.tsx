import { ReactNode } from 'react';
import { Typography } from '@mui/material';

export const DefaultEmptyComponent: ReactNode = (
  <div
    style={{
      width: '100%',
      textAlign: 'center',
      marginTop: '12px',
      marginBottom: '4px'
    }}
  >
    <Typography color="textSecondary">You are all caught up!</Typography>
  </div>
);
