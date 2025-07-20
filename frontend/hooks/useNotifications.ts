import { useEffect } from 'react';

// This hook manages the WebSocket connection for real-time notifications.
export const useNotifications = (onMessageCallback) => {
  useEffect(() => {
    // Establish a connection to your backend WebSocket server.
    const ws = new WebSocket('ws://localhost:5050'); // Ensure this port is correct

    ws.onopen = () => {
      console.log('Notification service connected.');
    };

    // When a message is received from the server...
    ws.onmessage = (event) => {
      const message = event.data;
      console.log('Notification received:', message);
      
      // ...execute the callback function provided by the component.
      if (onMessageCallback) {
        onMessageCallback(message);
      }
    };

    ws.onerror = (error) => {
      console.error('Notification service error:', error);
    };

    // Cleanup: Close the connection when the component unmounts.
    return () => {
      console.log('Notification service disconnected.');
      ws.close();
    };
  }, [onMessageCallback]); // Re-run the effect if the callback changes
};