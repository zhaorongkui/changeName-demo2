/*
 * @Author: linyongcai
 * @Date: 2024-12-19 15:46:38
 * @FilePath: \formula-editor\formula-editor\src\utils\index.ts
 * @Description: 页面描述
 */
import JSBeautify from 'js-beautify'
import type { FieldDataVo } from '../types'

/**
 * 获取指定位数的随机字符串
 * @param length
 * @returns
 */
export const generateRandomString = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  console.log(`随机数${length}位：`, result)
  return result
}

/**
 * 获取指定区间的随机整数
 * @param min
 * @param max
 * @returns
 */
export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
/**
 * 获取指定区间的随机整数数组
 * @param length
 * @param min
 * @param max
 * @returns
 */
export const generateRandomArray = (
  length: number,
  min: number,
  max: number,
) => {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(generateRandomNumber(min, max))
  }
  return result
}
/**
 * 根据数据类型获取随机数值
 * @param dataType
 * @param options
 * @returns
 */
export const generateRandomData = (
  dataType: string,
  options?: { length: number; min: number; max: number },
) => {
  const { length = 10, min = 0, max = 100 } = options || {}
  switch (dataType) {
    case 'string':
      return generateRandomString(length)
    case 'number':
      return generateRandomNumber(min, max)
    case 'array':
      return generateRandomArray(length, min, max)
    default:
      return generateRandomString(length)
  }
}

export const recursiveRepeatList = (
  list: FieldDataVo[],
  result: FieldDataVo[] = [],
) => {
  list.forEach((item) => {
    result.push(item)
    if (item.children) {
      recursiveRepeatList(item.children, result)
    }
  })
  return result
}

/**
 * 格式化js字符串
 * @param value
 */
export const formatScriptCode = (value: string) => {
  return JSBeautify.js(value, { indent_size: 2 })
}
