import './voltage-view.tag';
import './voltage-view-props.tag';
import image from './voltage-view.png';

dashboard.registerWidget('voltage-view', {
  label: 'Voltage View',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  minX: 3,
  minY: 2,
  properties: {
    tag: 'voltage-view-props',
    defaults: {
      min: 0,
      max: 5,
      center: 0,
      showText: false,
      numTickMarks: 5
    }
  }
});