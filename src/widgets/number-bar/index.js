const NumberBar = require('./number-bar');
const NumberBarProps = require('./number-bar-props');
const image = require('./number-bar.png');

dashboard.registerWidget('number-bar', {
  class: NumberBar,
  label: 'Number Bar',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  properties: {
    class: NumberBarProps,
    defaults: {
      min: -1,
      max: 1,
      center: 0,
      showText: true,
      numTickMarks: 5
    }
  }
});