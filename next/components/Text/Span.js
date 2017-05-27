import glamorous from 'glamorous'

const Span = glamorous.span(
  props => {
    if (props.ellipsis) {
      return {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }
    return null
  }
)
Span.propsAreCssOverrides = true

export default Span
