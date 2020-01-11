const BooleanBox = require('./boolean-box');
const BooleanBoxProps = require('./boolean-box-props')
const image = require('./boolean-box.png');

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