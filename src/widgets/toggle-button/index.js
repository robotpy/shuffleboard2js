const ToggleButton = require('./toggle-button');
const image = require('./toggle-button.png');

dashboard.registerWidget('toggle-button', {
  class: ToggleButton,
  label: 'Toggle Button',
  category: 'Basic',
  acceptedTypes: ['boolean'],
  image
});