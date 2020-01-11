const ComboBoxChooser = require('./combobox-chooser');
const image = require('./combobox-chooser.png');

dashboard.registerWidget('combobox-chooser', {
  class: ComboBoxChooser,
  label: 'ComboBox Chooser',
  category: 'Basic',
  acceptedTypes: ['String Chooser'],
  image
});