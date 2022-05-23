const fs = require('fs')
const assert = require('assert')
const iconBuilder = require('../src/stylesheet')

describe('Stylesheet TEST', function () {
  it('getData()', function () {
    const data = fs.readFileSync('./test/assets/valid.css', { encoding: 'utf8', flag: 'r' })

    const value = iconBuilder.getData(data)
    assert.ok(value)
  })
  it('getFontName()', function () {
    const data = fs.readFileSync('./test/assets/valid.css', { encoding: 'utf8', flag: 'r' })
    const value = iconBuilder.getData(data)
    const name = iconBuilder.getFontName(value)
    assert.ok(name)
  })
  it('getGlyphs()', function () {
    const data = fs.readFileSync('./test/assets/valid.css', { encoding: 'utf8', flag: 'r' })
    const value = iconBuilder.getData(data)
    const name = iconBuilder.getFontName(value)
    const glyphs = iconBuilder.getGlyphs(name, value)
    assert.ok(glyphs)
  })
})
