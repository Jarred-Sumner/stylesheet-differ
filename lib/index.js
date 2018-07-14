const transform = require('css-to-object')
const cssobj_core = require('cssobj-core')
const cssobj_plugin_gencss = require('cssobj-plugin-gencss')
const _ = require('lodash')

const cssobj = cssobj_core({
  plugins: [cssobj_plugin_gencss({ indent: '  ', newLine: '\n' })],
})

const stylemapper = d => {
  const map = {
    [d.key]: d.obj,
  }

  const oldProps = Object.keys(d.lastRaw)
  const newProps = Object.keys(d.obj)

  _.difference(oldProps, newProps).forEach(prop => {
    map[d.key][prop] = 'unset'
  })

  return cssobj(map).css
}

module.exports = (style, change) => {
  const obj = cssobj(transform(style))
  const diff = obj.update(transform(change)).diff

  let styles = []

  Object.keys(diff).forEach(dk => {
    styles = styles.concat(diff[dk].map(stylemapper))
  })

  return styles.join(`\n`).trim()
}