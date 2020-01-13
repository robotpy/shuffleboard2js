const VoltageView = require('./voltage-view');
const image = require('./voltage-view.png');

dashboard.registerWidget('voltage-view', {
  class: VoltageView,
  label: 'Voltage View',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  // properties: {
  //   tag: 'voltage-view-props',
  //   defaults: {
  //     min: 0,
  //     max: 5,
  //     center: 0,
  //     showText: false,
  //     numTickMarks: 5
  //   }
  // }
});