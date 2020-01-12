const DifferentialDrivebase =  require('./differential-drivebase');
const image = require('./differential-drivebase.png');

dashboard.registerWidget('differential-drivebase', {
  class: DifferentialDrivebase,
  label: 'Differential Drivebase',
  category: 'Basic',
  acceptedTypes: ['DifferentialDrive'],
  image
});