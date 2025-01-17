import { NotificationAPIContext } from '../Provider/context';
import { useContext } from 'react';
import { PreferenceInput } from './PreferenceInput';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
        <Accordion key={n.notificationId}>
          <AccordionSummary expandIcon={<ExpandMore />}>
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
                    <AccordionSummary expandIcon={<ExpandMore />}>
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

  return <>{items}</>;
}
