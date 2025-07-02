import { notifications } from '@mantine/notifications'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationOptions {
  title?: string
  message: string
  type?: NotificationType
  autoClose?: number
}

const getColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'green'
    case 'error':
      return 'red'
    case 'warning':
      return 'yellow'
    case 'info':
      return 'blue'
    default:
      return 'blue'
  }
}

export const notificationService = {
  show: ({ title, message, type = 'info', autoClose = 4000 }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: getColor(type),
      autoClose,
      position: 'top-center',
      withBorder: true,
      styles: {
        root: {
          marginTop: '10px',
          marginRight: '10px',
          marginLeft: '10px',
        },
      },
    })
  },

  success: (message: string, title?: string) => {
    notificationService.show({ title, message, type: 'success' })
  },

  error: (message: string, title?: string) => {
    notificationService.show({ title, message, type: 'error' })
  },

  warning: (message: string, title?: string) => {
    notificationService.show({ title, message, type: 'warning' })
  },

  info: (message: string, title?: string) => {
    notificationService.show({ title, message, type: 'info' })
  },
} 