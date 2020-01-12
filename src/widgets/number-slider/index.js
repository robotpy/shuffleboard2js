const NumberSlider =  require('./number-slider');
const NumberSliderProps = require('./number-slider-props');
const image = require('./number-slider.png');

dashboard.registerWidget('number-slider', {
  class: NumberSlider,
  label: 'Number Slider',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  properties: {
    class: NumberSliderProps,
    defaults: {
      min: -1,
      max: 1,
      blockIncrement: .0625
    }
  }
});