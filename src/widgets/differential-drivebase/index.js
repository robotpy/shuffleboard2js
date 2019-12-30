import './differential-drivebase';
import image from './differential-drivebase.png';

dashboard.registerWidget('differential-drivebase', {
  label: 'Differential Drivebase',
  category: 'Basic',
  acceptedTypes: ['DifferentialDrive'],
  image,
  minX: 7,
  minY: 5
});