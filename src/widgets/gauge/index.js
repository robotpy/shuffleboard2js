const GaugeWidget =  require('./gauge-widget');
const GaugeWidgetProps = require('./gauge-widget-props');
const image = require('./gauge.png');

dashboard.registerWidget('gauge-widget', {
  class: GaugeWidget,
  label: 'Gauge',
  category: 'Basic',
  acceptedTypes: ['number'],
  image,
  properties: {
    class: GaugeWidgetProps,
    defaults: {
      min: 0,
      max: 100
    }
  }
});