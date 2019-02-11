import './widget-a.tag';
import './properties.tag';
import image from "./widget-a.gif";

dashboard.registerWidget('widget-a', {
  label: 'Widget A',
  category: 'Category 1',
  acceptedTypes: ['string'],
  image,
  minX: 5,
  minY: 5,
  properties: {
    defaults: {
      a: 1
    },
    tag: 'widget-a-properties'
  }
});