const NetworkTables = require('./networktables');
const NetworkTablesProvider = require('./provider.js');

dashboard.sourceProviders.addType(NetworkTablesProvider);
window.NetworkTables = NetworkTables;

