import './index.css';
import App from './App';
import React from 'react';
import { DndProvider } from 'react-dnd'
import ReactDOM from 'react-dom/client';
import { HTML5Backend } from 'react-dnd-html5-backend';
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<DndProvider backend={HTML5Backend}>
			<App />
		</DndProvider>
	</React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*');

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message);
});
