import glamorous from 'glamorous'

const Circle = glamorous.div(({size, color}) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor: color
}))
Circle.propsAreCssOverrides = true

export default Circle
