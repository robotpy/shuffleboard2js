import './number-slider';
import './number-slider-props.tag';
import image from './number-slider.png';

dashboard.registerWidget('number-slider', {
  label: 'Number Slider',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  minX: 3,
  minY: 2,
  properties: {
    tag: 'number-slider-props',
    defaults: {
      min: -1,
      max: 1,
      blockIncrement: .0625
    }
  }
});