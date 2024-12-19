import { Divider } from 'antd';
import { Preferences } from './Preferences';
import WebPushOptInMessage from '../WebPush/WebPushOptInMessage';
import { useContext } from 'react';
import { NotificationAPIContext } from '../Provider/context';

type NotificationPreferencesInlineProps = object;

export function NotificationPreferencesInline(
  props: NotificationPreferencesInlineProps
) {
  const context = useContext(NotificationAPIContext);
  if (!context) {
    return null;
  }
  props;
  return (
    <>
      <Preferences />{' '}
      {context.webPushOptInMessage && (
        <div>
          <Divider style={{ margin: '10px 0' }} />
          <WebPushOptInMessage
            hideAfterInteraction={false}
            descriptionStyle={{
              flexDirection: 'column', // Stack the elements vertically
              justifyContent: 'flex-start', // Align items to the left
              fontSize: '14px',
              alignItems: 'flex-start' // Align items to the left
            }}
            buttonContainerStyle={{
              justifyContent: 'flex-start', // Align buttons to the left
              alignItems: 'flex-start', // Align buttons to the left
              marginTop: '10px' // Add some space between message and buttons
            }}
          />
        </div>
      )}
    </>
  );
}
