import { useContext } from 'react';
import { Preferences } from './Preferences';
import { NotificationAPIContext } from '../Provider/context';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import WebPushOptInMessage from '../WebPush/WebPushOptInMessage';

type NotificationPreferencesPopupProps = {
  open?: boolean;
  onClose?: () => void;
  collapse?: boolean;
};

export function NotificationPreferencesPopup(
  props: NotificationPreferencesPopupProps
) {
  const context = useContext(NotificationAPIContext);
  if (!context) {
    return null;
  }
  const config: Required<NotificationPreferencesPopupProps> = {
    open: props.open === undefined ? true : props.open,
    onClose: props.onClose || (() => {}),
    collapse: props.collapse === undefined ? false : props.collapse
  };

  return (
    <Dialog
      open={config.open}
      onClose={config.onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { borderRadius: 8 }
      }}
      aria-hidden={!config.open}
      scroll="body"
    >
      <DialogTitle>Notification Preferences</DialogTitle>
      <DialogContent>
        <Preferences />
        {context.webPushOptInMessage && (
          <div>
            <WebPushOptInMessage
              hideAfterInteraction={false}
              descriptionStyle={{ fontSize: 12 }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
