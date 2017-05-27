import glamorous from 'glamorous'
import Colors from '../../constants/colors'

const H2 = glamorous.h1({
  color: Colors.Black.NORMAL,
  fontSize: 24,
  lineHeight: 1.75,
  fontWeight: 300,
  marginBottom: 20
})
H2.propsAreCssOverrides = true

export default H2
