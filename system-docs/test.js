const test = require('ava')
const React = require('react')
const {
  propTypes,
  width,
  fontFamily,
  hover,
  textStyle
} = require('styled-system')
const sys = require('system-components').default
const parse = require('./index')
const {
  getPropTypes,
  getExtensions
} = require('./index')

test('returns an object', t => {
  const meta = getPropTypes(width.propTypes)
  t.is(typeof meta, 'object')
})

test('returns metadata for propTypes', t => {
  const meta = getPropTypes(width.propTypes)
  t.is(typeof meta.width, 'object')
  t.is(meta.width.prop, 'width')
})

test('returns metadata for multiple propTypes', t => {
  const meta = getPropTypes(Object.assign({}, textStyle.propTypes, fontFamily.propTypes))
  t.deepEqual(meta, {
    textStyle: {
      prop: 'textStyle',
      themeKey: 'textStyles',
      complex: true,
      description: undefined
    },
    fontFamily: {
      prop: 'fontFamily',
      themeKey: 'fonts',
      description: undefined
    }
  })
})

test('ignores non-styled-system propTypes', t => {
  const meta = getPropTypes({
    primary: () => {}
  })
  t.deepEqual(meta, {})
})

test('returns multiple extensions', t => {
  const A = props => React.createElement('div', props)
  A.displayName = 'A'
  const B = props => React.createElement('div', props)
  B.displayName = 'B'
  B.defaultProps = { is: A }
  const C = props => React.createElement('div', props)
  C.displayName = 'C'
  C.defaultProps = { is: B }
  const ext = getExtensions(C)
  t.true(Array.isArray(ext))
  t.is(ext.length, 2)
  t.is(ext[0], B)
  t.is(ext[1], A)
})

test('returns a full metadata object', t => {
  const Box = sys({
    is: 'div',
  }, 'space', 'color', 'width')
  const meta = parse(Box)
  t.is(typeof meta, 'object')
  t.is(meta.tagName, 'div')
  t.deepEqual(meta.extensions, [])
  t.truthy(typeof meta.propTypes.bg)
  t.truthy(typeof meta.propTypes.width)
  t.truthy(typeof meta.propTypes.m)
  t.truthy(typeof meta.propTypes.mx)
  t.truthy(typeof meta.propTypes.p)
  t.deepEqual(meta.propsTypes.color, {
    prop: 'color',
    themeKey: 'colors',
    responsive: true,
    description: undefined
  })
})

test('returns an empty object for invalid components', t => {
  const meta = parse({ notAComponent: 'derp' })
  t.isDeepEqual(meta, {})
})
