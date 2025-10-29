/*
 * @Author: linyongcai
 * @Date: 2024-12-20 09:41:19
 * @FilePath: \formula-editor\formula-editor\src\formulaConfig\mathFormula.ts
 * @Description: 数学函数
 */

export const mathFormula = {
  name: '数学函数',
  enCode: 'math',
  formula: [
    {
      name: 'sum',
      enCode: 'sum',
      tip: '求和',
      example: 'sum(指标变量)',
      usage: '在一定的时间范围内，某个指标的所有数值的和。',
    },
    {
      name: 'sumd',
      enCode: 'sumd',
      tip: '浮点数求和',
      example: 'sumd(指标变量)',
      usage: '在一定的时间范围内，某个指标的所有数值的和。',
    },
    {
      name: 'avg',
      enCode: 'avg',
      tip: '求平均值',
      example: 'avg(指标变量)',
      usage: '在一定的时间范围内，某个指标的所有数值的均值',
    },
    {
      name: 'avgd',
      enCode: 'avgd',
      tip: '求浮点数平均值',
      example: 'avgd(指标变量)',
      usage: '在一定的时间范围内，某个指标的所有数值的均值',
    },
    {
      name: 'max',
      enCode: 'max',
      tip: '求最大值',
      example: 'max(指标变量)',
      usage: '在一定的时间范围内，某个指标的所有数值中获取最大值',
    },
    {
      name: 'min',
      enCode: 'min',
      tip: '求最小值',
      example: 'min(X)',
      usage: '在一定的时间范围内，某个指标的所有数值中获取最小值',
    },
    {
      name: 'first',
      enCode: 'first',
      tip: '取第一个值',
      example: 'first(X)',
      usage: '在一定的时间范围内，某个指标的所有数值中获取时间最小的指标值',
    },
    {
      name: 'last',
      enCode: 'last',
      tip: '取最后一个值',
      example: 'last(X)',
      usage: '在一定的时间范围内，某个指标的所有数值中获取时间最大的指标值',
    },
  ],
}
