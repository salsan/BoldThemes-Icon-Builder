import { RuleInterface, CssInterface } from './lib/CssInterface'

const css = require('css')

function getData (data:string): CssInterface {
  const objCss = css.parse(data)
  const err: number = objCss.stylesheet.parsingErrors.length

  if (err !== 0) process.exit(1)

  return objCss
}

function getFontName (css:CssInterface):string {
  for (let i:number = 0; i < css.stylesheet.rules.length; i++) {
    if (css.stylesheet.rules[i].type === 'font-face') {
      return css.stylesheet.rules[i].declarations[0].value.replace(/['"\s]/g, '')
    }
  }
  return ''
}

function getGlyphs (fontName:string, css: CssInterface):string {
  let fontData:string = ''
  const items: RuleInterface[] = css.stylesheet.rules

  for (let i:number = 0; i < items.length; i++) {
    if (items[i].type === 'rule' && (items[i].selectors.length === 1)) {
      const glyphName: RegExpMatchArray | null = items[i].selectors[0].match(/(-?[_a-zA-Z]+[_a-zA-Z0-9-]*):before/)
      const glyphValue: RegExpMatchArray | null = items[i].declarations[0].value.match(/^"\\(\w{4})"/)

      if ((glyphName !== null) && (glyphValue !== null)) {
        fontData += `    '${glyphName[1]} (${fontName})' => $set . '_${glyphValue[1]}',\n`
      }
    }
  }

  return fontData.replace(/,\n$/, '\n);')
}

module.exports = {
  getData,
  getFontName,
  getGlyphs
}
