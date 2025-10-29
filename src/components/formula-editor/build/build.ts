/*
 * @Author: linyongcai
 * @Date: 2024-12-20 14:41:08
 * @FilePath: \formula-editor\formula-editor\build\build.ts
 * @Description: 页面描述
 */
import path from 'node:path'
import consola from 'consola'
import chalk from 'chalk'

import { type BuildOptions, type Format, build } from 'esbuild'
import GlobalsPlugin from 'esbuild-plugin-globals'
import vue from 'unplugin-vue/esbuild'
import { emptyDir } from 'fs-extra'
import { version } from '../package.json'
import { pathOutput, pathSrc } from './paths'

const buildBundle = () => {
  const getBuildOptions = (format: Format) => {
    const options: BuildOptions = {
      entryPoints: [
        path.resolve(pathSrc, 'index.ts'),
        path.resolve(pathSrc, 'global.ts'),
      ],
      target: 'es2021',
      platform: 'node',
      plugins: [
        vue({
          isProduction: true,
          sourceMap: false,
          // https://github.com/vuejs/core/issues/5256#issuecomment-1173891407
          template: { compilerOptions: { hoistStatic: false } },
        }),
      ],
      bundle: true,
      format,
      minifySyntax: true,
      banner: {
        js: `/*! Element Plus Icons Vue v${version} */\n`,
      },
      outdir: pathOutput,
    }
    if (format === 'iife') {
      options.plugins!.push(
        GlobalsPlugin({
          vue: 'Vue',
        }),
      )
      options.globalName = 'BeFormulaEditor'
    } else {
      options.external = ['vue', 'element-plus']
    }

    return options
  }
  const doBuild = async (minify: boolean) => {
    await Promise.all([
      build({
        ...getBuildOptions('esm'),
        entryNames: `[name]${minify ? '.min' : ''}`,
        minify,
      }),
      /*  build({
        ...getBuildOptions('iife'),
        entryNames: `[name].iife${minify ? '.min' : ''}`,
        minify,
      }), */
      build({
        ...getBuildOptions('cjs'),
        entryNames: `[name]${minify ? '.min' : ''}`,
        outExtension: { '.js': '.cjs' },
        minify,
      }),
    ])
  }

  return Promise.all([doBuild(true), doBuild(false)])
}

consola.info(chalk.blue('cleaning dist...'))
await emptyDir(pathOutput)
consola.info(chalk.blue('building...'))
await buildBundle()

consola.info(chalk.blue('building complete'))

// const ls = spawn('pnpm run -C src/theme-chalk build')

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`)
// })
// ls.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`)
// })
// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`)
// })
// exec('pnpm run -C src/theme-chalk build', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`执行的错误: ${error}`)
//     return
//   }
//   consola.log(`theme-chalk complete`)
//   if (stderr) {
//     consola.log(`stderr: ${stderr}`)
//   }
// })
