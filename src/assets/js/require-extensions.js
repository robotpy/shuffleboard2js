import { readFileSync } from 'fs';
import { basename, dirname } from 'path';


const getFileContent = (module, filename) => {
  module.exports = readFileSync(filename, 'utf8');
};

const getFilePath = (module, filename) => {
  module.exports = filename;
};

window.require.extensions['.html'] = getFileContent;

window.require.extensions['.tag'] = (module, filename) => {
  const fileContents = readFileSync(filename, 'utf8');
  const requireCode = `
    const require = (path) => {
      const finalPath = window.require('path').join("${dirname(filename)}", path);
      return window.require(finalPath);
    };
  `;
  const tagCode = riot.compile(`
    (function() {
      ${requireCode + fileContents}
    })();
  `);
  eval(tagCode);
};

['.png', '.jpg', '.gif'].forEach(extension => {
  window.require.extensions[extension] = getFilePath;
});