import Solstice from '../dist/solstice';
import test from 'blue-tape'

test('should be a function', t => {
  t.equal(typeof Solstice, 'function')
  t.end()
})

test('throws error if instantiated wrong', t => {
  t.throws(() => {
    Solstice()
  })
  t.end()
})

test('throws error if instantiated without supplied element', t => {
  t.throws(() => {
    let sols = new Solstice()
  })
  t.end()
})

test('does not throw if instantiated properly with element supplied', t => {
  let defaultDiv = document.createDocumentFragment();
  t.doesNotThrow(() => {
    let sols = new Solstice(defaultDiv);
  })
  t.end()
})
