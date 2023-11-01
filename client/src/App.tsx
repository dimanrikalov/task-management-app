import './App.css'
import io from 'socket.io-client';
import { useEffect, useState } from 'react'

function App() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3002');

    socket.on('workspaceCreated', (payload) => {
      setNotifications(prev => [...prev, payload.message]);
    });

    socket.on('userAddedToWorkspace', (payload) => {
      setNotifications(prev => [...prev, payload.message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3003');

    socket.on('boardCreated', (payload) => {
      setNotifications(prev => [...prev, payload.message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {
        notifications.map((x, i) => <p key={i}>{x}</p>)
      }
    </div>
  );
}

export default App


