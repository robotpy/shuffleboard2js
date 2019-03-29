import './combobox-chooser.tag';
import image from './combobox-chooser.png';

dashboard.registerWidget('combobox-chooser', {
  label: 'ComboBox Chooser',
  category: 'Basic',
  acceptedTypes: ['String Chooser'],
  image,
  minX: 3,
  minY: 2
});