import glamorous from 'glamorous'

const Column = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  paddingLeft: 15,
  paddingRight: 15
})
Column.propsAreCssOverrides = true

export default Column
