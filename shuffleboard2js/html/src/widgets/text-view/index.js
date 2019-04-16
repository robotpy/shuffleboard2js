import './text-view.tag';
import image from './text-view.png';

dashboard.registerWidget('text-view', {
  label: 'Text View',
  category: 'Basic',
  acceptedTypes: ['boolean', 'number', 'string'],
  defaultsFor: ['string', 'number'],
  image,
  minX: 2,
  minY: 2
});