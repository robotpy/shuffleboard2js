import { join, dirname } from 'path';
import { get } from 'lodash';

export const getRobotIp = () => {
  return localStorage.robotIp || 'localhost';
};

export const setRobotIp = (robotIp) => {
  localStorage.robotIp = robotIp;
};

export const hasDashboardPath = () => {
  return 'dashboardPath' in localStorage;
};

export const getDashboardPath = () => {
  return localStorage.dashboardPath;
};

export const setDashboardPath = (path) => {
  localStorage.dashboardPath = path;
};

export const getDashboardConfigPath = () => {
  return join(dirname(getDashboardPath()), 'dashboard-config.json');
};

export const setDashboardConfig = (config) => {
  localStorage.dashboardConfig = JSON.stringify(config);
};

export const getWidgetSource = (widgetId) => {
  try {
    const config = JSON.parse(localStorage.dashboardConfig);
    return get(config, `widgetSources["${widgetId}"]`, null);
  }
  catch(e) {
    return null;
  }
};

export const getDefaultWidgetFolder = () => {
  return localStorage.defaultWidgetFolder;
};

export const setDefaultWidgetFolder = (path) => {
  localStorage.defaultWidgetFolder = path;
};