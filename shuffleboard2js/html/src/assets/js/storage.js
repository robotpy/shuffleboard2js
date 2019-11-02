
export const getRobotIp = () => {
  return localStorage.robotIp || 'localhost';
};

export const setRobotIp = (robotIp) => {
  localStorage.robotIp = robotIp;
};