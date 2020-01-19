const NetworkTables = require('./networktables');
const provider = require('./provider.js');
require('./settings-element');

dashboard.sourceProviders.add('NetworkTables', provider);
NetworkTables.connect(dashboard.storage.get('robotIp', 'localhost'));
window.NetworkTables = NetworkTables;

