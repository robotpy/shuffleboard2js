import './toggle-button.tag';
import image from './toggle-button.png';

dashboard.registerWidget('toggle-button', {
  label: 'Toggle Button',
  category: 'Basic',
  acceptedTypes: ['boolean'],
  image,
  minX: 2,
  minY: 2
});