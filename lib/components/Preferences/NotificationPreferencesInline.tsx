import { Divider } from 'antd';
import { Preferences } from './Preferences';
import WebPushOptInMessage from '../WebPush/WebPushOptInMessage';
import { useContext } from 'react';
import { NotificationAPIContext } from '../Provider';

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
      {!context.hideWebPushOptInMessage && (
        <div>
          <Divider style={{ margin: '10px 0' }} />
          <WebPushOptInMessage hideAfterInteraction={false} />
        </div>
      )}
    </>
  );
}
