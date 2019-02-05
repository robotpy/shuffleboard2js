import './pid-tuner.tag';
import image from './pig.png';

dashboard.registerWidget('pid-tuner', {
  label: 'PID Tuner',
  category: 'Sensors',
  acceptedTypes: ['PIDController'],
  image,
  minX: 3,
  minY: 3
});