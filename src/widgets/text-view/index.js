const TextView = require('./text-view');
const image = require('./text-view.png');

dashboard.registerWidget('text-view', {
  class: TextView,
  label: 'Text View',
  category: 'Basic',
  acceptedTypes: ['boolean', 'number', 'string'],
  image
});