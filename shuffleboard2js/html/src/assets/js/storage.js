
export const getRobotIp = () => {
  return localStorage.robotIp || 'localhost';
};

export const setRobotIp = (robotIp) => {
  localStorage.robotIp = robotIp;
};

export const getDefaultLayoutPath = () => {
  return localStorage.defaultLayoutPath;
};

export const setDefaultLayoutPath = (path) => {
  localStorage.defaultLayoutPath = path;
};