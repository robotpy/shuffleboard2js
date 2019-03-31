import './toggle-switch.tag';
import image from './toggle-switch.png';

dashboard.registerWidget('toggle-switch', {
  label: 'Toggle Switch',
  category: 'Basic',
  acceptedTypes: ['boolean'],
  image,
  minX: 2,
  minY: 2
});