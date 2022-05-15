const fs = require('fs')
const css = require('css')
const path = require('path')

interface DeclarationsInterface {
    type: 'declaration';
    property: 'content';
    value: string;
}

interface RuleInterface {
    type: 'font-face' | 'rule';
    selectors: string[];
    declarations: DeclarationsInterface[];
}

interface StylesheetInterface {
    rules:RuleInterface[];
}

interface CssInterface {
    type: 'stylesheet';
     stylesheet: StylesheetInterface;
}

const source: string = process.argv.slice(2)[0]

fs.readFile(source, 'utf8', function (err:string, data:string) {
  if (err) {
    return console.log(err)
  }

  const obj: CssInterface = getCss(data)
  const rules: RuleInterface[] = getSelectors(obj)
  const fontName:string = getFontName(obj)
  const fontPath:string = path.dirname(source)

  createFile(fontName, fontPath)

  const glyphList:string[] = getGlyphList(rules)

  appendFile(fontName, fontPath, glyphList)
})

function getCss (data:string): CssInterface {
  const objCss = css.parse(data)
  const err: number = objCss.stylesheet.parsingErrors.length

  if (err !== 0) process.exit(1)

  return objCss
}

function getSelectors (selectors: CssInterface): RuleInterface[] {
  return (selectors.stylesheet.rules)
}

function createFile (fdName:string, fdPath: string) {
  // const fontFile = `${fdPath}/${fdName}.php`

  const fontFile = path.join(fdPath, `${fdName}.php`)
  const headerPhp = `<?php\n
$set = strtolower( basename(__FILE__, '.php') );\n
$$set = array(\n`

  fs.writeFile(fontFile, headerPhp, function (err:string) {
    if (err) {
      return console.log(err)
    }
  })
}

function appendFile (fontName:string, fdPath: string, glyphList:string[]) {
  // const fontFile:string = `${fontName}.php`
  const fontFile: string = path.join(fdPath, `${fontName}.php`)
  let FontData:string = ''

  for (let i:number = 0; i < glyphList.length; i++) {
    const glyph = glyphList[i].split(',')
    if (i === glyphList.length - 1) {
      FontData = `    '${glyph[0]} (${fontName})' => $set . '_${glyph[1]}'\n);`
    } else {
      FontData = `    '${glyph[0]} (${fontName})' => $set . '_${glyph[1]}',\n`
    }

    fs.appendFile(fontFile, FontData, (err:string) => {
      if (err) {
        throw err
      }
    })
  }

  console.log(`${fontFile} is created`)
}

function getFontName (css:CssInterface):string {
  for (let i:number = 0; i < css.stylesheet.rules.length; i++) {
    if (css.stylesheet.rules[i].type === 'font-face') {
      return css.stylesheet.rules[i].declarations[0].value.replace(/['"\s]/g, '')
    }
  }
  return ''
}

function getGlyphList (items: RuleInterface[]):string[] {
  const glyphList:string[] = []

  for (let i:number = 0; i < items.length; i++) {
    if (items[i].type === 'rule' && (items[i].selectors.length === 1)) {
      const glyphName: RegExpMatchArray | null = items[i].selectors[0].match(/(-?[_a-zA-Z]+[_a-zA-Z0-9-]*):before/)
      const glyphValue: RegExpMatchArray | null = items[i].declarations[0].value.match(/^"\\(\w{4})"/)

      if ((glyphName !== null) && (glyphValue !== null)) { glyphList.push(`${glyphName[1]},${glyphValue[1]}`) }
    }
  }

  return glyphList
}
