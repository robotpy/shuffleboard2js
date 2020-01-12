const RelayWidget = require('./relay');
const image = require('./relay.png');

dashboard.registerWidget('relay-widget', {
  class: RelayWidget,
  label: 'Relay',
  category: 'Basic',
  acceptedTypes: ['Relay'],
  image
});