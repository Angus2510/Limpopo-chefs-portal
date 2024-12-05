"use client";
import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';

const NotificationRequest = ({ id, userType }) => {
  const socketContext = useSocket();
  const socket = socketContext ? socketContext.socket : null;

  useEffect(() => {
    if (!socket) {
      console.warn("Socket is not available, skipping notification setup.");
      return;
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          subscribeUserToPush();
        } else {
          console.log('Notification permission denied.');
        }
      });
    } else {
      subscribeUserToPush();
    }
  }, [socket]);

  const subscribeUserToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered:', registration);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      console.log('Push subscription:', subscription);

      if (!id || !userType) {
        console.warn('id or userType is missing, cannot send subscription to server.');
        return;
      }
  
      let userId =id;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/push`, {
        method: 'POST',
        body: JSON.stringify({ subscription, userId, userType }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Subscription sent to server');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return null;
};

export default NotificationRequest;
