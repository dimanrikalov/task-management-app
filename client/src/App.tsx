import './App.css'
import io from 'socket.io-client';
import { useEffect, useState } from 'react'

interface IPayload {
  message: string;
  affectedUserId: number;
}

function App() {
  const userId = 1;
  const [notifications, setNotifications] = useState<string[]>([]);


  useEffect(() => {
    const socket = io('http://localhost:3002');

    socket.on('workspaceCreated', (payload: IPayload) => {
      console.log(payload);
      //if jwtToken.id from the localStorage == any of the users inside the payload trigger a getWorkspaces request
      if(payload.affectedUserId === userId) {
        setNotifications(prev => [...prev, payload.message]);
      }
    });

    socket.on('userAddedToWorkspace', (payload: IPayload) => {
      //if jwtToken.id from the localStorage === any of the users inside the payload trigger a getWorkspaces request
      if(payload.affectedUserId === userId) {
        setNotifications(prev => [...prev, payload.message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3003');

    socket.on('boardCreated', (payload: IPayload) => {
      //if jwtToken.id from the localStorage === any of the users inside the payload trigger a getBoards request
      if(payload.affectedUserId === userId) {
        setNotifications(prev => [...prev, payload.message]);
      }
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


