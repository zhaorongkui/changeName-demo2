/*
 * @Author: linyongcai
 * @Date: 2024-12-19 13:46:38
 * @FilePath: \formula-editor\formula-editor\build\paths.ts
 * @Description: 页面描述
 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))

export const pathRoot = resolve(dir, '..')
export const pathSrc = resolve(pathRoot, 'src')
export const pathComponents = resolve(pathSrc, 'components')
export const pathOutput = resolve(pathRoot, 'dist')
