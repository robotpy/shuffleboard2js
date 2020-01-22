const callbacks = {};

export const on = (eventName, callback) => {
  if (typeof callbacks[eventName] === 'undefined') {
    callbacks[eventName] = [];
  }

  callbacks[eventName].push(callback);
};

export const trigger = (eventName, ...args) => {
  if (eventName in callbacks) {
    callbacks[eventName].forEach(callback => {
      if (typeof callback === 'function') {
        callback(...args);
      }
    });
  }
};
