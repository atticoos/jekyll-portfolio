import glamorous from 'glamorous'

const Row = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
})

Row.propsAreCssOverrides = true

export default Row
