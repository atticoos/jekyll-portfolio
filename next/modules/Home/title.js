import glamorous from 'glamorous'
import {H1} from '../../components/Text'

const Title = glamorous(H1)({
  fontSize: 48,
  marginBottom: 80,
  textAlign: 'center'
})
Title.propsAreCssOverrides = true

export default Title
