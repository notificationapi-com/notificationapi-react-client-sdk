import React from 'react';
import { Button, Form, Input } from 'antd';
import { NotificationAPIProvider } from '../lib/main';
import { InAppNotification } from '@notificationapi/core/dist/interfaces';

export const FakeNotification: React.FC = () => {
  const notificationapi = NotificationAPIProvider.useNotificationAPIContext();
  const [form] = Form.useForm();
  const onFinish = (
    values: Omit<InAppNotification, 'id' | 'notificationId' | 'seen' | 'date'>
  ) => {
    const notification: InAppNotification = {
      ...values,
      date: new Date().toISOString(),
      seen: false,
      id: Math.random().toString(36).substr(2, 9),
      notificationId: Math.random().toString(36).substr(2, 9),
      template: {
        instant: {
          title: values.title,
          redirectURL: 'https://notificationapi.com',
          imageURL: 'https://via.placeholder.com/150'
        },
        batch: {
          title: values.title,
          redirectURL: 'https://notificationapi.com',
          imageURL: 'https://via.placeholder.com/150'
        }
      }
    };
    notification.title = values.title ?? 'My fake notification';
    notificationapi.addNotificationsToState([notification]);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <Form.Item
        name="title"
        label="Title"
        // rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input placeholder="My fake notification" />
      </Form.Item>

      <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
        Generate a Fake Notification
      </Button>
    </Form>
  );
};
