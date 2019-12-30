import './gauge-widget';
import './gauge-widget-props';
import image from './gauge.png';

dashboard.registerWidget('gauge-widget', {
  label: 'Gauge',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  minX: 3,
  minY: 2,
  properties: {
    tag: 'gauge-widget-props',
    defaults: {
      min: 0,
      max: 100
    }
  }
});