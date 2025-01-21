import React, { useContext } from 'react';
import { NotificationAPIContext } from '../Provider/context';
import { Alert, Button } from '@mui/material';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';

interface WebPushOptInMessageProps {
  hideAfterInteraction?: boolean;
  alertContainerStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  buttonContainerStyle?: React.CSSProperties;
  yesButtonStyle?: React.CSSProperties;
  cancelButtonStyle?: React.CSSProperties;
  description?: string; // Optional prop to override the alert description
  icon?: React.ReactNode; // Optional prop to override the alert icon
}
const WebPushOptInMessage: React.FC<WebPushOptInMessageProps> = ({
  hideAfterInteraction: hideAfterInteraction,
  alertContainerStyle: customAlertContainerStyle,
  descriptionStyle: customDescriptionStyle,
  buttonContainerStyle: customButtonContainerStyle,
  yesButtonStyle: customYesButtonStyle,
  cancelButtonStyle: customCancelButtonStyle,
  description: customDescription,
  icon: customIcons
}) => {
  const context = useContext(NotificationAPIContext);
  if (!context) {
    return null;
  }

  const alertContainerStyle = {
    marginBottom: '10px',
    borderRadius: '5px',
    padding: '10px',
    fontSize: '12px', // Smaller font size
    margin: '10px auto', // Center if width is more than 500px
    display: 'flex',
    alignItems: 'center', // Align items vertically
    ...customAlertContainerStyle
  };

  const descriptionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically
    fontSize: '12px',
    width: '100%',
    ...customDescriptionStyle
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    ...customButtonContainerStyle
  };

  const yesButtonStyle = {
    marginLeft: '10px',
    marginRight: '10px',
    fontSize: '10px',
    ...customYesButtonStyle
  };

  const cancelButtonStyle = {
    fontSize: '10px',
    ...customCancelButtonStyle
  };

  return (
    <Alert
      severity="info"
      icon={customIcons ?? <LanguageOutlined type="text" />}
      style={alertContainerStyle}
    >
      <div style={descriptionStyle}>
        <span>
          {customDescription ??
            `Would you like to enable web push notifications to stay updated?`}
        </span>
        <div style={buttonContainerStyle}>
          <Button
            style={yesButtonStyle}
            onClick={() => {
              if (hideAfterInteraction) {
                localStorage.setItem('hideWebPushOptInMessage', 'true');
              }
              context.setWebPushOptIn(true);
              context.setWebPushOptInMessage(false);
            }}
          >
            Yes
          </Button>
          <Button
            style={cancelButtonStyle}
            onClick={() => {
              if (hideAfterInteraction) {
                localStorage.setItem('hideWebPushOptInMessage', 'true');
              }
              context.setWebPushOptInMessage(false);
            }}
          >
            No
          </Button>
        </div>
      </div>
    </Alert>
  );
};

export default WebPushOptInMessage;
