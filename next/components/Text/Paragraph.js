import glamorous from 'glamorous'
import Colors from '../../constants/colors'

const P = glamorous.p({
  color: Colors.Black.NORMAL,
  fontSize: 20,
  fontWeight: 300,
  lineHeight: '32px',
  marginTop: '1em',
  marginBottom: '1em'
})
P.propsAreCssOverrides = true

export default P
