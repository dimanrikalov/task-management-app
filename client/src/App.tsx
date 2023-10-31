import './App.css'
import io from 'socket.io-client';
import { useEffect, useState } from 'react'

function App() {
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3002'); // Replace with your server URL

    socket.on('workspaceCreated', (payload) => {
      console.log("Received workspace created event: ");
      console.log(payload);
      setNotification(`A new workspace has been created. You have access to it.`);
      // Handle the notification as needed
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <p>{notification}</p>
    </div>
  );
}

export default App


