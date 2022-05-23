import { CssInterface } from './lib/CssInterface'
const fs = require('fs')
const path = require('path')
const isCss = require('@salsan/iscss')
const stylesheet = require('./stylesheet')

// const source: string = process.argv.slice(2)[0]

export = function init (source: string) {
  fs.readFile(source, 'utf8', function (err:string, data:string) {
    if (err) {
      return console.log(err)
    }

    if (isCss(data)) {
      const obj: CssInterface = stylesheet.getData(data)
      const fontName:string = stylesheet.getFontName(obj)
      const glyphList:string = stylesheet.getGlyphs(fontName, obj)

      const fontPath:string = path.dirname(source)
      createFile(fontName, fontPath)
      appendFile(fontName, fontPath, glyphList)
    } else console.log(`${source} is not valid CSS`)
  })
}

function createFile (fdName:string, fdPath: string) {
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

function appendFile (fontName:string, fdPath: string, glyphList:string) {
  const fontFile: string = path.join(fdPath, `${fontName}.php`)

  fs.appendFile(fontFile, glyphList, (err:string) => {
    if (err) {
      throw err
    }
  })

  console.log(`${fontFile} is created`)
}
