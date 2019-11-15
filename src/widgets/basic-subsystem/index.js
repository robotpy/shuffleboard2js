import './basic-subsystem.tag';
import image from './basic-subsystem.png';

dashboard.registerWidget('basic-subsystem', {
  label: 'Basic Subsystem',
  category: 'Basic',
  acceptedTypes: ['Subsystem'],
  image,
  minX: 4,
  minY: 2
});