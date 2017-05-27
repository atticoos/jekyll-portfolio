import glamorous from 'glamorous'
import Dimensions from '../../constants/dimensions'

const Container = glamorous.section({
  paddingLeft: Dimensions.Padding.PAGE_SECTION,
  paddingRight: Dimensions.Padding.PAGE_SECTION,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 15,
  paddingRight: 15,

  // tablet
  '@media (min-width: 768px)': {
    width: 750
  },

  // desktop
  '@media (min-width: 1200px)': {
    width: 1170,
  },
})
Container.propsAreCssOverrides = true

export default Container
