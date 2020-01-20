const NetworkTables = require('./networktables');
const NetworkTablesProvider = require('./provider.js');
require('./settings-element');

dashboard.sourceProviders.addType('NetworkTables', NetworkTablesProvider);
window.NetworkTables = NetworkTables;

