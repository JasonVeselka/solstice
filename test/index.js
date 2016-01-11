// require all `test/**/index.js`
// current directory and all subdirectories
const testsContext = require.context('./', false, /test\.js$/);
testsContext.keys().forEach(testsContext);

// require all `src/**/index.js`
// current directory and all subdirectories
const componentsContext = require.context('../src/', false, /solstice\.js$/);
componentsContext.keys().forEach(componentsContext);
