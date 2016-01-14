// require test/index.text.js`
const testsContext = require.context('./', false, /test\.js$/);
testsContext.keys().forEach(testsContext);

// require src/solstice.js`
const componentsContext = require.context('../src/', false, /solstice\.js$/);
componentsContext.keys().forEach(componentsContext);
