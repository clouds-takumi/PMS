import moment from 'moment'
import BraftEditor from 'braft-editor'

export const dataFormat = (obj, rules, reverse) => {
  rules.forEach(rule => {
    const { key, type, format } = rule
    if (type === 'html') {
      obj[key] = !reverse ? obj[key].toHTML() : BraftEditor.createEditorState(obj[key])
    }
    if (type === 'moment') {
      obj[key] = !reverse ? obj[key].format(format ? format : 'YYYY-MM-DD') : moment(obj[key])
    }
    if (type === 'color') {
      obj[key] = !reverse ? obj[key].hex : obj[key]
    }
  })

  return { ...obj }
}
