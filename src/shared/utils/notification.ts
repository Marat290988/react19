import { notifications } from '@mantine/notifications';

export const showNotification = (message: string, color: 'blue' | 'red' = 'blue') => {
  notifications.show({
    withCloseButton: true,
    autoClose: 3000,
    message: message,
    position: 'top-right',
    color: color,
  });
}