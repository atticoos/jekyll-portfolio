import glamorous from 'glamorous'

const Row = glamorous.div({
  display: 'flex',
  flexDirection: 'row',

  '@media (max-width: 767px)': {
    marginBottom: 40,
    flexDirection: 'column'
  }
})
Row.propsAreCssOverrides = true

export default Row
