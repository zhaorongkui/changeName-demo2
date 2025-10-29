import path from 'node:path'
import { Transform } from 'node:stream'
import { writeFile } from 'node:fs/promises'
import chalk from 'chalk'
import { dest, parallel, series, src } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import copy from 'gulp-copy'
import autoprefixer from 'gulp-autoprefixer'
import consola from 'consola'
import postcss from 'postcss'
import cssnano from 'cssnano'
import through, { type TransformCallback } from 'through2'
import type { TaskFunction } from 'gulp'
// import { pathOutput } from '../../build/paths'
const pathOutput = path.resolve(__dirname, '../../dist')
const distFolder = path.resolve(__dirname, './dist')
const distBundle = path.resolve(pathOutput, './theme-chalk')

/**
 * using `postcss` and `cssnano` to compress CSS
 * @returns
 */
function compressWithCssnano() {
  const processor = postcss([
    cssnano({
      preset: [
        'default',
        {
          // avoid color transform
          colormin: false,
          // avoid font transform
          minifyFontValues: false,
        },
      ],
    }),
  ])
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const file = chunk
      if (file.isNull()) {
        callback(null, file)
        return
      }
      if (file.isStream()) {
        callback(new Error('Streaming not supported'))
        return
      }
      const cssString = file.contents!.toString()
      processor.process(cssString, { from: file.path }).then((result) => {
        const name = path.basename(file.path)
        file.contents = Buffer.from(result.css)
        consola.success(
          `${chalk.cyan(name)}: ${chalk.yellow(
            cssString.length / 1000,
          )} KB -> ${chalk.green(result.css.length / 1000)} KB`,
        )
        callback(null, file)
      })
    },
  })
}

/**
 * compile theme-chalk scss & minify
 * not use sass.sync().on('error', sass.logError) to throw exception
 * @returns
 */
function buildThemeChalk() {
  const sass = gulpSass(dartSass)
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(compressWithCssnano())
    .pipe(dest(distFolder))
}

/**
 * copy from theme-chalk/dist/index.css to dist/index.css
 */
export function copyThemeChalkBundle() {
  return src(path.resolve(distFolder, './*.css'))
    .pipe(copy(distBundle, { prefix: 1 }))
    .pipe(verify())
}
function verify() {
  const options = { objectMode: true }
  return through(options, write, end)
  function write(file: any, enc: BufferEncoding, cb: TransformCallback) {
    console.log('file', file.path)
    cb(null, file)
  }

  function end(cb: Function) {
    console.log('done')
    cb()
  }
}
export const build: TaskFunction = parallel(
  series(buildThemeChalk, copyThemeChalkBundle),
)

// eslint-disable-next-line import/no-default-export
export default build
