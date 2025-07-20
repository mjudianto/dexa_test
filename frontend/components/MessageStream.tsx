import React, { useState, useEffect } from 'react';

function MessageStreamTest() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Establish a WebSocket connection to the Node.js server
    const ws = new WebSocket('ws://localhost:5050'); // Adjust port if needed

    // Define the event listener for incoming messages
    ws.onmessage = (event) => {
      const newMessage = event.data;
      console.log('Message from server:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.onopen = () => console.log('WebSocket connection established.');
    ws.onerror = (error) => console.error('WebSocket Error:', error);

    // Cleanup function to close the connection when the component unmounts
    return () => {
      console.log('Closing WebSocket connection.');
      ws.close();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <p>Messages published to the backend will appear here instantly.</p>
      <ul id="message-list">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default MessageStreamTest;