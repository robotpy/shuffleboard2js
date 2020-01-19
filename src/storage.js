import { join, dirname } from 'path';
import { get as lodashGet } from 'lodash';

export const set = (key, value) => {
  localStorage[key] = JSON.stringify(value);
};

export const has = (key) => {
  return key in localStorage;
};

export const get = (key, defaultValue) => {
  try {
    return has(key) ? JSON.parse(localStorage[key]) : defaultValue;
  } catch(e) {
    return null;
  }
};

export const hasDashboardPath = () => {
  return has('dashboardPath');
};

export const getDashboardPath = () => {
  return get('dashboardPath');
};

export const setDashboardPath = (path) => {
  set('dashboardPath', path);
};

export const getDashboardConfigPath = () => {
  return join(dirname(getDashboardPath()), 'dashboard-config.json');
};

export const setDashboardConfig = (config) => {
  set('dashboardConfig', config);
};

export const getWidgetSource = (widgetId) => {
  const config = get('dashboardConfig');
  return lodashGet(config, `widgetSources["${widgetId}"]`, null);
};

export const getDefaultWidgetFolder = () => {
  return get('defaultWidgetFolder');
};

export const setDefaultWidgetFolder = (path) => {
  set('defaultWidgetFolder', path);
};

export const isEditModeOn = () => {
  return get('editModeOn', true);
};

export const turnEditModeOn = () => {
  set('editModeOn', true);
};

export const turnEditModeOff = () => {
  set('editModeOn', false);
};