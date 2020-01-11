import BooleanBox from './boolean-box';
import BooleanBoxProps from './boolean-box-props';
import image from './boolean-box.png';

dashboard.registerWidget('boolean-box', {
  class: BooleanBox,
  label: 'Boolean Box',
  category: 'Basic',
  acceptedTypes: ['boolean'],
  defaultsFor: ['boolean'],
  image,
  properties: {
    class: BooleanBoxProps,
    defaults: {
      colorWhenTrue: '#00ff00',
      colorWhenFalse: '#ff0000'
    }
  }
});