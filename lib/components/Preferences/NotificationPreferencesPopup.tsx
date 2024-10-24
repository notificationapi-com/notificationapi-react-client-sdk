import { Divider, Modal } from 'antd';
import { Preferences } from './Preferences';
import { useContext } from 'react';
import { NotificationAPIContext } from '../Provider';
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
    <Modal
      title="Notification Preferences"
      open={config.open}
      onCancel={() => {
        config.onClose();
      }}
      footer={null}
      zIndex={9999}
    >
      <Preferences />
      {!context.hideWebPushOptInMessage && (
        <div>
          <Divider style={{ margin: '10px 0' }} />
          <WebPushOptInMessage hideAfterInteraction={false} />
        </div>
      )}
    </Modal>
  );
}
