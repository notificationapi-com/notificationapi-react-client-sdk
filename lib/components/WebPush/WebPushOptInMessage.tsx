import React, { useContext } from 'react';
import { Alert, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { NotificationAPIContext } from '../Provider';

interface WebPushOptInMessageProps {
  hideAfterInteraction?: boolean;
  alertStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  spanStyle?: React.CSSProperties;
  buttonContainerStyle?: React.CSSProperties;
  primaryButtonStyle?: React.CSSProperties;
  secondaryButtonStyle?: React.CSSProperties;
  message?: string; // Optional prop to override the alert message
  icon?: React.ReactNode; // Optional prop to override the alert icon
}
const WebPushOptInMessage: React.FC<WebPushOptInMessageProps> = ({
  hideAfterInteraction: hideAfterInteraction,
  alertStyle: customAlertStyle,
  descriptionStyle: customDescriptionStyle,
  spanStyle: customSpanStyle,
  buttonContainerStyle: customButtonContainerStyle,
  primaryButtonStyle: customPrimaryButtonStyle,
  secondaryButtonStyle: customSecondaryButtonStyle,
  message: customMessage,
  icon: customIcons
}) => {
  const context = useContext(NotificationAPIContext);
  if (!context) {
    return null;
  }

  const alertStyle = {
    marginBottom: '10px',
    borderRadius: '5px',
    padding: '10px',
    fontSize: '12px', // Smaller font size
    margin: '10px auto', // Center if width is more than 500px
    display: 'flex',
    alignItems: 'center', // Align items vertically
    ...customAlertStyle
  };

  const descriptionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically
    fontSize: '12px',
    width: '100%',
    ...customDescriptionStyle
  };

  const spanStyle = {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    ...customSpanStyle
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    ...customButtonContainerStyle
  };

  const primaryButtonStyle = {
    marginLeft: '10px',
    marginRight: '10px',
    fontSize: '10px',
    ...customPrimaryButtonStyle
  };

  const secondaryButtonStyle = {
    fontSize: '10px',
    ...customSecondaryButtonStyle
  };

  return (
    <Alert
      type="info"
      showIcon
      icon={customIcons ?? <GlobalOutlined type="text" />}
      style={alertStyle}
      description={
        <div style={descriptionStyle}>
          <span style={spanStyle}>
            {customMessage ??
              `Would you like to enable web push notifications to stay updated?`}
          </span>
          <div style={buttonContainerStyle}>
            <Button
              type="primary"
              style={primaryButtonStyle}
              onClick={() => {
                if (hideAfterInteraction) {
                  localStorage.setItem('hideWebPushOptInMessage', 'true');
                }
                context.setWebPushOptIn(true);
                context.setHideWebPushOptInMessage(true);
              }}
            >
              Yes
            </Button>
            <Button
              style={secondaryButtonStyle}
              onClick={() => {
                if (hideAfterInteraction) {
                  localStorage.setItem('hideWebPushOptInMessage', 'true');
                }
                context.setHideWebPushOptInMessage(true);
              }}
            >
              No
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default WebPushOptInMessage;