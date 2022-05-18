import { CssInterface } from './lib/CssInterface'
const fs = require('fs')
const path = require('path')
const stylesheet = require('./stylesheet')

const source: string = process.argv.slice(2)[0]

fs.readFile(source, 'utf8', function (err:string, data:string) {
  if (err) {
    return console.log(err)
  }

  const obj: CssInterface = stylesheet.getData(data)
  const fontName:string = stylesheet.getFontName(obj)
  const fontPath:string = path.dirname(source)

  createFile(fontName, fontPath)

  const glyphList:string = stylesheet.getGlyphs(fontName, obj)

  appendFile(fontName, fontPath, glyphList)
})

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
