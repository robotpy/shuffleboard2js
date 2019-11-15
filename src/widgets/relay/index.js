import './relay.tag';
import image from './relay.png';

dashboard.registerWidget('relay', {
  label: 'Relay',
  category: 'Basic',
  acceptedTypes: ['Relay'],
  image,
  minX: 2,
  minY: 4,
});