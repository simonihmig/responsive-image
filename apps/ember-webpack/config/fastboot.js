'use strict';

module.exports = function () {
  return {
    buildSandboxGlobals(defaultGlobals) {
      return { ...defaultGlobals, URL, URLSearchParams };
    },
  };
};
