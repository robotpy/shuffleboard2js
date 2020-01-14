import { join, dirname } from 'path';

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

export const getDefaultWidgetFolder = () => {
  return localStorage.defaultWidgetFolder;
};

export const setDefaultWidgetFolder = (path) => {
  localStorage.defaultWidgetFolder = path;
};