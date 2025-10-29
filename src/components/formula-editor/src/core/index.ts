import { shallowRef } from 'vue'
import { formatScriptCode, generateRandomString } from '../utils'
import type {
  BaseFormulaVo,
  CodemirrorMarksVo,
  FormulaBaseUseVo,
  ParamsFieldVo,
} from '../types'
import type {
  Editor,
  EditorChange,
  EditorChangeCancellable,
  EditorEventMap,
  Hint,
  Hints,
  MarkerRange,
  Position,
} from 'codemirror'

export default class FormulaEditorCore {
  editor: Editor | null = null // 编辑器实例
  formulaObjList: BaseFormulaVo[] = [] // 公式对象列表

  get text() {
    return this.editor?.getValue() ?? ''
  }
  set text(value: string) {
    this.editor?.setValue(value)
  }
  get marks() {
    return (
      this.editor
        ?.getAllMarks()
        .filter((o) => o.className === 'cm-field')
        .map((marks) => {
          const { attributes } = marks
          return {
            ...(marks.find() as MarkerRange),
            enCode: attributes?.['data-enCode'] ?? '',
            uid: attributes?.['data-uid'] ?? '',
          }
        }) ?? []
    )
  }
  listen: (keyof EditorEventMap)[] = ['change', 'inputRead', 'beforeChange'] // 监听方法
  constructor(
    editor: Editor,
    text: string = '',
    formulaObjList: BaseFormulaVo[] = [],
  ) {
    this.editor = editor
    this.text = text
    this.formulaObjList = formulaObjList
    this.registerListen()
  }
  // 获取公式列表
  getFormulaList() {
    return this.formulaObjList.flatMap((o) => o.formula)
  }

  // 数据回显
  renderData(formulaData: { text: string; marks: CodemirrorMarksVo[] }) {
    if (Object.keys(formulaData).length === 0) return
    const { text, marks } = formulaData
    this.text = text
    marks.forEach((o) => {
      if (o.from && o.to) {
        this.addMarkText(o.from, o.to, o.enCode, o.uid)
      }
    })
    this.editor?.focus()
    this.editor?.setCursor(this.editor.lineCount(), 0)
  }

  // 注册监听器
  registerListen() {
    for (const item of this.listen) {
      const eventName = `on${item.charAt(0).toUpperCase()}${item.slice(1)}`
      const fn = this[eventName]
      // eslint-disable-next-line prefer-rest-params
      this.editor?.on(item, fn.bind(this, ...arguments))
    }
  }

  onInputRead(editor: Editor) {
    editor.showHint({
      hint: this.customHint.bind(this),
      completeSingle: false,
    })
  }
  onBeforeChange(editor: Editor, changeObj: EditorChangeCancellable) {
    //粘贴时格式化javascript文本
    if (changeObj.origin === 'paste') {
      changeObj.cancel()
      const text = this.text
      const newText = formatScriptCode(changeObj.text.join(''))
      editor.setValue(text + newText)
      editor.setCursor(editor.lineCount(), 0)
    }
  }
  // 当编辑器中文本内容改变
  onChange(editor: Editor, changeObj: EditorChange) {
    if (changeObj.origin === 'complete') {
      // 向左移动一个字符
      this.moveCursor('left', 1)
    }
  }
  getData(): { text: string; marks: CodemirrorMarksVo[] } {
    return {
      text: this.text,
      marks: this.marks,
    }
  }
  reset() {
    this.text = ''
  }
  /**
   * 插入文本
   * @param {string | object} text
   * @param {'formula' | 'field'} type
   */
  insertText(
    data: string | ParamsFieldVo | FormulaBaseUseVo,
    type: 'formula' | 'field' | 'custom',
  ) {
    const _data = JSON.parse(JSON.stringify(data))
    if (type === 'field' && !_data.uid) {
      _data.uid = generateRandomString(20)
    }
    const from = this.editor!.getCursor()

    if (['field', 'custom'].includes(type)) {
      const fieldFrom = { ...from }
      //自定义公式
      if (type === 'custom') {
        const customField: FormulaBaseUseVo = _data
        const formulaText = customField.example
        this.editor?.replaceRange(formulaText, fieldFrom)
        customField.replace?.forEach((key: string) => {
          let _i = formulaText.indexOf(key)
          while (_i > -1) {
            const stratPos = this.editor!.posFromIndex(from.ch + _i)
            const endPos = this.editor!.posFromIndex(stratPos.ch + key.length)
            this.addMarkText(stratPos, endPos, key)
            _i = formulaText.indexOf(key, _i + 1)
          }
        })
      } else {
        const field: ParamsFieldVo = _data
        const to = { ...from, ch: from.ch + field.key.length }
        this.editor?.replaceRange(field.key, fieldFrom)
        this.addMarkText(fieldFrom, to, field.key, field.uid)
      }
    } else {
      this.editor?.replaceRange(_data, from)
    }
    type === 'formula' && this.moveCursor('left', 1)
    this.editor?.focus()
  }

  getMarkByUid(uid: string) {
    const marks =
      this.editor?.getAllMarks().filter((o) => o.className === 'cm-field') ?? []
    return marks.find((mark) => {
      const { attributes } = mark
      return attributes!['data-uid'] === uid
    })
  }
  /**
   * 新增标签
   * @param {Pisition} from
   * @param to
   * @param key
   * @param uid
   */
  addMarkText(from: Position, to: Position, key: string, uid?: string) {
    if (!uid) {
      uid = generateRandomString(20)
    }
    this.editor?.markText(from, to, {
      className: 'cm-field',
      attributes: {
        'data-enCode': key,
        'data-uid': uid,
      },
      atomic: true,
    })
  }
  /**
   * 更新mraks
   * @param {CodemirrorMarksVo} oldMark
   * @param {string} content
   */
  updateMarks = (oldMarks: CodemirrorMarksVo[], content: string) => {
    oldMarks.forEach((oldMark) => {
      const mark = this.getMarkByUid(oldMark.uid)
      if (mark) {
        const markData = mark.find() as MarkerRange
        this.editor?.replaceRange('', markData.from, markData.to)
        this.editor?.setCursor(markData.from)
        this.insertText(
          { key: content, uid: oldMark.uid } as ParamsFieldVo,
          'field',
        )
      }
    })
  }
  /**
   *
   * @param {'left' | 'right' | 'up' | 'down'} direction 方向
   * @param {number} step 步长
   */
  moveCursor(direction: 'left' | 'right' | 'up' | 'down', step: number) {
    const cursor = this.editor!.getCursor()
    const line = cursor.line
    const ch = cursor.ch

    // 检查是否已经在行首
    if (direction === 'left') {
      // 如果不是行首，则向左移动字符
      this.editor?.setCursor({ line, ch: ch - step })
    } else if (direction === 'right') {
      // 如果是行首，则向右移动字符
      this.editor?.setCursor({ line, ch: ch + step })
    } else if (direction === 'up') {
      // 如果是行首，则向上移动行
      this.editor?.setCursor({ line: line - step, ch })
    } else if (direction === 'down') {
      // 如果是行首，则向下移动行
      this.editor?.setCursor({ line: line + step, ch })
    }
  }
  // 匹配当前行的公式
  matchWord(text: string) {
    // 使用正则表达式提取出字母部分
    const match = text.match(/[A-Za-z]+$/)
    return match ? match[0] : ''
  }
  // 自定义提示函数
  customHint(cm: Editor) {
    // 游标
    const cursor = cm.getCursor()
    // 当前行文本
    const currentLineText = cm.getLine(cursor.line)
    const matchWords = this.matchWord(currentLineText)
    const start = cursor.ch
    const suggestions = this.getFormulaList()
    const formatList: {
      text: string
      displayText: string
      tip: string
      render?: (element: HTMLLIElement, data: Hints, cur: Hint) => void
    }[] = suggestions.map((o) => ({
      text: `${o.name}()`,
      displayText: o.name,
      tip: o.tip,
    }))
    const result = {
      list: formatList
        .filter(
          (suggestion) =>
            matchWords &&
            suggestion.text.toLowerCase().includes(matchWords.toLowerCase()),
        )
        .map((suggestion) => {
          const text = suggestion.displayText
          const matchIndex = text
            .toLowerCase()
            .indexOf(matchWords.toLowerCase())
          suggestion.render = function (element: HTMLElement) {
            if (matchIndex >= 0) {
              const beforeMatch = text.slice(0, matchIndex)
              const match = text.slice(
                matchIndex,
                matchIndex + matchWords.length,
              )
              const afterMatch = text.slice(matchIndex + matchWords.length)

              const span = document.createElement('span')

              if (beforeMatch) {
                span.append(document.createTextNode(beforeMatch))
              }

              const highlight = document.createElement('span')
              highlight.textContent = match
              highlight.style.fontWeight = 'bold'
              highlight.style.color = '#ff0000'
              span.append(highlight)

              if (afterMatch) {
                span.append(document.createTextNode(afterMatch))
              }

              element.append(span)
            } else {
              element.append(document.createTextNode(text))
            }
          }

          return suggestion
        }),
      from: { line: cursor.line, ch: start - matchWords.length },
      to: { line: cursor.line, ch: start },
    }
    return result
  }
  [key: string]: any
}
