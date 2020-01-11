const BasicFmsInfo = require('./basic-fms-info');
const image = require('./basic-fms-info.png');

dashboard.registerWidget('basic-fms-info', {
  class: BasicFmsInfo,
  label: 'Basic FMS Info',
  category: 'Basic',
  acceptedTypes: ['FMSInfo'],
  image
});