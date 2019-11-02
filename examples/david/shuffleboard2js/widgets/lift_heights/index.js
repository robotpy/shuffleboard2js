require('./lift_heights.tag');
const image = require('./rocket_ship_transparent.png');

dashboard.registerWidget('lift_heights', {
  label: 'Lift Heights',
  category: 'Lift Heights',
  acceptedTypes: ['int'],
  image,
  minX: 5,
  minY: 5
});