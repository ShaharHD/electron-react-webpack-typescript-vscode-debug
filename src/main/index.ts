import { app, BrowserWindow, ipcMain } from 'electron';
import electron_is_dev from 'electron-is-dev';
import setupPug from 'electron-pug';
import WindowStateKeeper from 'electron-window-state';

try {
  import('electron-reload').then((reloader) => reloader.default(__dirname));
} catch (err) {
  // electron-reload only for development environment
}
let mainWindow: BrowserWindow, splashWindow: BrowserWindow;

function initSplashWindow(): void {
  splashWindow = new BrowserWindow({
    width: 300,
    height: 300,
    center: true,
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    maximizable: false,
    minimizable: false,
    resizable: false,
    movable: false,
    show: false,
  });

  const splashPug = require('./views/splash.pug');
  splashWindow.loadFile(splashPug);

  splashWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.show();
      splashWindow.focus();
    }
  });

  splashWindow.once('closed', () => {
    splashWindow = null;
  });
}

function initMainWindow(): void {
  const mainWindowState = WindowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768,
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    titleBarStyle: 'default',
    show: false,
  });

  mainWindowState.manage(mainWindow);

  const appPug = require('./views/app.pug');
  mainWindow.loadFile(appPug);

  mainWindow.once('closed', () => {
    mainWindow = null;
  });
}

app.once('ready', async () => {
  try {
    const pug = await setupPug({ pretty: electron_is_dev });
    pug.on('error', (err) => console.error('electron-pug error', err));
  } catch (err) {
    console.log('Could not initiate electron-pug: ', err);
  }

  try {
    const installer = await import('electron-devtools-installer');
    const tools = [installer.REACT_DEVELOPER_TOOLS, installer.REDUX_DEVTOOLS];
    const installExtension = installer.default;

    tools.forEach((extension) => {
      installExtension(extension)
        .then((name) => console.log(`Added Extension: ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    });
  } catch {
    // electron-devtools-installer only for development environment
  }

  initSplashWindow();
  initMainWindow();
});

app.once('window-all-closed', () => {
  app.quit();
});

ipcMain.once('app-is-ready', () => {
  splashWindow.close();
  mainWindow.show();
  mainWindow.focus();
});
