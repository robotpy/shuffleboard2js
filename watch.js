const { watch } = require('fs');
const { dirname } = require('path');


watch(dirname(window.require.resolve('../widgets')), { recursive: true }, () => {
  window.location.reload();
});

watch(dirname(window.require.resolve('../source-providers')), { recursive: true }, () => {
  window.location.reload();
});