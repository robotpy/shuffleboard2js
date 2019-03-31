import './gauge.tag';
import './gauge-props.tag';
import image from './gauge.png';

dashboard.registerWidget('gauge', {
  label: 'Gauge',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  minX: 3,
  minY: 2,
  properties: {
    tag: 'gauge-props',
    defaults: {
      min: 0,
      max: 100
    }
  }
});