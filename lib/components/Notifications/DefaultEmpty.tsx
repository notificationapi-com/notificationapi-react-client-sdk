import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

export const DefaultEmptyComponent: ReactNode = (
  <Box marginTop={'12px'} marginBottom={'4px'}>
    <Typography color="textSecondary" textAlign={'center'}>
      You are all caught up!
    </Typography>
  </Box>
);
