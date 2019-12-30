import './number-bar';
import './number-bar-props';
import image from './number-bar.png';

dashboard.registerWidget('number-bar', {
  label: 'Number Bar',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  minX: 3,
  minY: 2,
  properties: {
    tag: 'number-bar-props',
    defaults: {
      min: -1,
      max: 1,
      center: 0,
      showText: true,
      numTickMarks: 5
    }
  }
});