import './relay';
import image from './relay.png';

dashboard.registerWidget('relay-widget', {
  label: 'Relay',
  category: 'Basic',
  acceptedTypes: ['Relay'],
  image,
  minX: 2,
  minY: 4,
});