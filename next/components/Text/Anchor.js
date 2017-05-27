import glamorous from 'glamorous'
import Colors from '../../constants/colors'

const A = glamorous.a({
  textDecoration: 'none',
  color: Colors.Blue.NORMAL
})

A.propsAreCssOverrides = true

export default ({newWindow, ...rest}) => (
  <A
    target={newWindow ? '_blank' : '_self'}
    {...rest}
  />
)
