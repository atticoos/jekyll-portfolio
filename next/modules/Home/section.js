import glamorous from 'glamorous'
import {Container} from '../../components/Layout'

const Section = glamorous(Container)({
  paddingBottom: 60
})
Section.propsAreCssOverrides = true

export default Section
