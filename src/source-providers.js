const providers = {};

export const add = (providerName, config) => {
  providers[providerName] = {
    updateFromProvider: () => {},
    updateFromDashboard: () => {},
    settingsElement: 'div',
    ...config
  };
};

export const get = (providerName) => {
  return providers[providerName];
};

export const getNames = () => {
  return Object.keys(providers);
};

export const has = (providerName) => {
  return providerName in providers;
};