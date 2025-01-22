import { useContext } from 'react';
import { NotificationAPIContext } from '../Provider/context';
import { PreferenceInput } from './PreferenceInput';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export function Preferences() {
  const context = useContext(NotificationAPIContext);

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
            (p) => p.subNotificationId === sn.subNotificationId
          )
      );

      return (
        <Accordion
          key={n.notificationId}
          style={{
            marginBottom: 0,
            marginTop: 0
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            style={{
              backgroundColor: '#f0f0f0',
              flexDirection: 'row-reverse',
              gap: 16
            }}
          >
            <Typography variant="body1">{n.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
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
                    style={{
                      marginTop: 12
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      style={{
                        flexDirection: 'row-reverse',
                        gap: 16
                      }}
                    >
                      <Typography variant="body1">{sn.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
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

  return <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>{items}</Box>;
}
