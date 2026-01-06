import { useContext } from 'react';
import { NotificationAPIContext } from '../Provider/context';
import { PreferenceInput } from './PreferenceInput';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { getThemeColors } from '../../utils/theme';

export function Preferences() {
  const context = useContext(NotificationAPIContext);
  const theme = useTheme();
  const themeColors = getThemeColors(theme);

  if (!context || !context.preferences) {
    return null;
  }

  const items = context.preferences.notifications
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((n) => {
      const mainPreferences = context.preferences?.preferences.filter(
        (p) => p.notificationId === n.notificationId && !p.subNotificationId
      );

      const subPreferences = context.preferences?.preferences.filter(
        (sn) => sn.notificationId === n.notificationId && sn.subNotificationId
      );

      const subNotifications = context.preferences?.subNotifications.filter(
        (sn) =>
          subPreferences?.find(
            (p) =>
              p.subNotificationId === sn.subNotificationId &&
              p.notificationId === sn.notificationId
          )
      );

      return (
        <Accordion
          key={n.notificationId}
          sx={{
            marginBottom: 0,
            marginTop: 0,
            backgroundColor: themeColors.paper,
            color: themeColors.text,
            '&:before': {
              backgroundColor: themeColors.divider
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: themeColors.text }} />}
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
              flexDirection: 'row-reverse',
              gap: 16,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <Typography variant="body1" sx={{ color: themeColors.text }}>
              {n.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ backgroundColor: themeColors.paper, color: themeColors.text }}
          >
            <>
              <PreferenceInput
                key={n.notificationId}
                notification={n}
                preferences={mainPreferences || []}
                updateDelivery={context.updateDelivery}
              />

              {subNotifications?.map((sn) => {
                return (
                  <Accordion
                    key={`${sn.notificationId}-${sn.subNotificationId}`}
                    sx={{
                      marginTop: 12,
                      backgroundColor: themeColors.paper,
                      color: themeColors.text,
                      '&:before': {
                        backgroundColor: themeColors.divider
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMore sx={{ color: themeColors.text }} />
                      }
                      sx={{
                        flexDirection: 'row-reverse',
                        gap: 16,
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.03)'
                            : 'rgba(0, 0, 0, 0.01)',
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.06)'
                              : 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: themeColors.text }}
                      >
                        {sn.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        backgroundColor: themeColors.paper,
                        color: themeColors.text
                      }}
                    >
                      <PreferenceInput
                        key={sn.subNotificationId}
                        notification={n}
                        preferences={subPreferences || []}
                        updateDelivery={context.updateDelivery}
                        subNotificationId={sn.subNotificationId}
                      />
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </>
          </AccordionDetails>
        </Accordion>
      );
    });

  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: themeColors.paper,
        color: themeColors.text
      }}
    >
      {items}
    </Box>
  );
}
