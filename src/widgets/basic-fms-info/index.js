import BasicFmsInfo from './basic-fms-info';
import image from './basic-fms-info.png';

dashboard.registerWidget('basic-fms-info', {
  class: BasicFmsInfo,
  label: 'Basic FMS Info',
  category: 'Basic',
  acceptedTypes: ['FMSInfo'],
  image
});