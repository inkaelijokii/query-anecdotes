import React, { useEffect } from 'react'
import { useNotification } from './NotificationContext'

const Notification = () => {
  const { notification, dispatch } = useNotification()

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification, dispatch])

  if (!notification) return null

  return <div style={{ border: '1px solid', padding: '10px' }}>{notification}</div>
}

export default Notification
