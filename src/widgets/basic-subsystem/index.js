const BasicSubsystem = require('./basic-subsystem');
const image = require('./basic-subsystem.png');

dashboard.registerWidget('basic-subsystem', {
  class: BasicSubsystem,
  label: 'Basic Subsystem',
  category: 'Basic',
  acceptedTypes: ['Subsystem'],
  image
});