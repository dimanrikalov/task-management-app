import path from 'node:path';
import { app, shell, BrowserWindow } from 'electron';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
	? process.env.DIST
	: path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
	const isMac = process.platform === 'darwin';
	const iconPath = isMac
		? path.join(process.env.VITE_PUBLIC, 'icon.icns')
		: path.join(process.env.VITE_PUBLIC, 'icon.ico');

	win = new BrowserWindow({
		icon: iconPath,
		autoHideMenuBar: true,
		webPreferences: {
			// devTools: false
			preload: path.join(__dirname, 'preload.js'),
		},
		width: 1330,
		height: 810,
		minHeight: 485,
		minWidth: 856
	});

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send(
			'main-process-message',
			new Date().toLocaleString()
		);
	});

	win.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url); // Open URL in user's browser.
		return { action: 'deny' }; // Prevent the app from opening the URL.
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(process.env.DIST, 'index.html'));
	}
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
