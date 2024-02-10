import './index.css';
import App from './App';
// import React from 'react';
import ReactDOM from 'react-dom/client';

let resizeTimer: NodeJS.Timeout | null;

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
	<App />
	// </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*');

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message);
});

window.addEventListener("resize", () => {
	document.body.classList.add('remove-transitions');
	if (resizeTimer) {
		clearTimeout(resizeTimer);
	}

	resizeTimer = setTimeout(() => {
		document.body.classList.remove('remove-transitions');
	}, 200);
})