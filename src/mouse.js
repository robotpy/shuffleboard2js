import $ from 'jQuery';

let pageX = 0;
let pageY = 0;
let prevPageX = 0;
let prevPageY = 0;
let eventType = null;

$(window).on('mousemove drag', (ev) => {
  eventType = ev.type;
  prevPageX = pageX;
  prevPageY = pageY;
  pageX = ev.pageX;
  pageY = ev.pageY;
});

export const getPageX = () => {
  // The last event that's fired on a drag event is garbage,
  // so always use the previous pageX
  if (eventType === 'drag') {
    return prevPageX;
  }
  return pageX;
};

export const getPageY = () => {
  // The last event that's fired on a drag event is garbage,
  // so always use the previous pageY
  if (eventType === 'drag') {
    return prevPageY;
  }
  return pageY;
};


