import './boolean-box.tag';
import './boolean-box-props.tag';
import image from './boolean-box.png';

dashboard.registerWidget('boolean-box', {
  label: 'Boolean Box',
  category: 'Basic',
  acceptedTypes: ['boolean'],
  defaultsFor: ['boolean'],
  image,
  minX: 2,
  minY: 2,
  properties: {
    tag: 'boolean-box-props',
    defaults: {
      colorWhenTrue: '#00ff00',
      colorWhenFalse: '#ff0000'
    }
  }
});