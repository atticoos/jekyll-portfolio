import glamorous from 'glamorous'

const Horizontal = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
})

Horizontal.propsAreCssOverrides = true

export default Horizontal
