import './text-view.tag';
import image from './text-view.png';

dashboard.registerWidget('text-view', {
  label: 'Text View',
  category: 'Basic',
  acceptedTypes: ['boolean', 'number', 'string'],
  image,
  minX: 2,
  minY: 2
});