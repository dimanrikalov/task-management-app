import './index.css';
import App from './App';
import i18n from 'i18next';
// import React from 'react';
import ReactDOM from 'react-dom/client';
import { en, bg } from './translations';
import { initReactI18next } from 'react-i18next';

let resizeTimer: NodeJS.Timeout | null;

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: en,
		},
		bg: {
			translation: bg,
		},
	},
	lng: localStorage.getItem('lng') || 'bg',
	fallbackLng: 'bg',
	interpolation: {
		escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
	},
});

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