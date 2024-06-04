import { Modal } from "antd";
import { Preferences } from "./Preferences";

type NotificationPreferencesPopupProps = {
  open?: boolean;
  onClose?: () => void;
  collapse?: boolean;
};

export function NotificationPreferencesPopup(
  props: NotificationPreferencesPopupProps
) {
  const config: Required<NotificationPreferencesPopupProps> = {
    open: props.open === undefined ? true : props.open,
    onClose: props.onClose || (() => {}),
    collapse: props.collapse === undefined ? false : props.collapse,
  };

  return (
    <Modal
      title="Notification Preferences"
      open={config.open}
      onCancel={() => {
        config.onClose();
      }}
      footer={null}
    >
      <Preferences />
    </Modal>
  );
}
