import { Preferences } from './Preferences';
import { useContext } from 'react';
import { NotificationAPIContext } from '../Provider/context';
import WebPushOptInMessage from '../WebPush/WebPushOptInMessage';
import { Dialog } from '@mui/material';

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
    <Dialog open={config.open} onClose={config.onClose} maxWidth="md" fullWidth>
      <Preferences />
      {context.webPushOptInMessage && (
        <div>
          <WebPushOptInMessage
            hideAfterInteraction={false}
            descriptionStyle={{ fontSize: 12 }}
          />
        </div>
      )}
    </Dialog>
  );
}
