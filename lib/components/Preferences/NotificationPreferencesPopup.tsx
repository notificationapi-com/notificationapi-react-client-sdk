import React from "react";
import { Modal } from "antd";
import { Preferences } from "./Preferences";

type NotificationPreferencesPopupProps = {
  open?: boolean;
  onClose?: () => void;
};

export function NotificationPreferencesPopup(
  props: NotificationPreferencesPopupProps
) {
  const config: Required<NotificationPreferencesPopupProps> = {
    open: props.open === undefined ? true : props.open,
    onClose: props.onClose || (() => {}),
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
