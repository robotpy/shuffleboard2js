import './gyro.tag';
import image from './gyro.png';

dashboard.registerWidget('gyro', {
  label: 'Camera',
  category: 'Sensors',
  acceptedTypes: ['Camera'],
  image,
  minX: 3,
  minY: 3
});