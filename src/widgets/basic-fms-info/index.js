import './basic-fms-info';
import image from './basic-fms-info.png';

dashboard.registerWidget('basic-fms-info', {
  label: 'Basic FMS Info',
  category: 'Basic',
  acceptedTypes: ['FMSInfo'],
  image,
  minX: 7,
  minY: 3
});