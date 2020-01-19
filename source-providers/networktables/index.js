window.NetworkTables = require('./networktables');
require('./settings-element');
const provider = require('./provider.js');

dashboard.sourceProviders.add('networktables', provider);
window.NetworkTables.connect(dashboard.storage.get('robotIp', 'localhost'));

