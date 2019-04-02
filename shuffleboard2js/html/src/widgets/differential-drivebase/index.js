import './differential-drivebase.tag';
import image from './differential-drivebase.png';

dashboard.registerWidget('differential-drivebase', {
  label: 'Differential Drivebase',
  category: 'Basic',
  acceptedTypes: ['DifferentialDrive'],
  image,
  minX: 5,
  minY: 5
});