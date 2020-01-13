const ToggleSwitch = require('./toggle-switch');
const image = require('./toggle-switch.png');

dashboard.registerWidget('toggle-switch', {
  class: ToggleSwitch,
  label: 'Toggle Switch',
  category: 'Basic',
  acceptedTypes: ['boolean'],
  image
});