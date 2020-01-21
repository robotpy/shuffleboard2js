import { readFileSync } from 'fs';
import { dirname } from 'path';


const getFileContent = (module, filename) => {
  module.exports = readFileSync(filename, 'utf8');
};

const getFilePath = (module, filename) => {
  module.exports = filename;
};

window.require.extensions['.html'] = getFileContent;


['.png', '.jpg', '.gif'].forEach(extension => {
  window.require.extensions[extension] = getFilePath;
});