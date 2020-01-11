import BasicSubsystem from './basic-subsystem';
import image from './basic-subsystem.png';

dashboard.registerWidget('basic-subsystem', {
  class: BasicSubsystem,
  label: 'Basic Subsystem',
  category: 'Basic',
  acceptedTypes: ['Subsystem'],
  image
});