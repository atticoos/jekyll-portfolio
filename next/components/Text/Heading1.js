import glamorous from 'glamorous'
import Colors from '../../constants/colors'

const H1 = glamorous.h1({
  color: Colors.Black.NORMAL,
  fontSize: 42,
  fontWeight: 300,
  marginTop: 28,
  marginBottom: 0
})
H1.propsAreCssOverrides = true

export default H1
