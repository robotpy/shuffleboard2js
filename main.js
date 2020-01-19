  
// Basic init
const electron = require('electron');
const electronConnect = require('electron-connect');

const { app, BrowserWindow } = electron;
const electronConnectClient = electronConnect.client;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
/**
 * The Main Window of the Program
 * @type {Electron.BrowserWindow}
 * */
let mainWindow;

function createWindow() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 570,
    show: false,
    icon: __dirname + '/../images/icon.png',
    webPreferences: {
      nodeIntegration: true
    }
  });
  // Move window to top (left) of screen.
  mainWindow.setPosition(0, 0);
  // Load window.
  mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
  // Once the python server is ready, load window contents.
  mainWindow.once('ready-to-show', () => {
      console.log('main window is ready to be shown');
      mainWindow.show();
  });

  // Remove menu
  //mainWindow.setMenu(null);
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
      console.log('main window closed');
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
  });
  mainWindow.on('unresponsive', () => {
      console.log('Main Window is unresponsive');
  });
  mainWindow.webContents.on('did-fail-load', () => {
      console.log('window failed load');
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
    console.log('app is ready');
    createWindow();
    electronConnectClient.create(mainWindow);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q.
    // Not like we're creating a consumer application though.
    // Let's just kill it anyway.
    // If you want to restore the standard behavior, uncomment the next line.

    // if (process.platform !== 'darwin')
    app.quit();
});

app.on('quit', function () {
    console.log('Application quit.');
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow == null) createWindow();
});
