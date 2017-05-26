import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import NavBar from '../components/navbar'
import Colors from '../constants/colors'
import glamorous, {Div, Span} from 'glamorous'
import Row from '../components/row'
import A from '../components/anchor'
import withWindowDimensions from '../utils/withWindowDimensions'
import * as FontAwesome from 'react-icons/lib/fa'


const isClient = typeof window !== 'undefined'


class DotCanvas extends React.Component {
  componentDidMount() {
    require('../components/dots').default();
  }

  render() {
    return (
      <Div
        className="dots-canvas"
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={1}
        height={window.innerHeight}
      />
    )
  }
}

export default () => (
  <div>
    <Head title="Home" />

    {isClient && <DotCanvas />}
    <Div position="relative" backgroundColor="transparent" zIndex={2}>
      {false && <NavBar />}

      <Introduction />


      <Div height={900} backgroundColor="gray" marginVertical={10} />
      <Div height={900} backgroundColor="lightgray" marginVertical={10} />
      <Div height={900} backgroundColor="gray" marginVertical={10} />
    </Div>
  </div>
)

function Introduction () {
  const Decorated = withWindowDimensions(windowProps => {
    console.log('window props', windowProps)
    return (
    <Div
      height={windowProps.windowHeight}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="transparent"
    >
      <Card width={500}>
        <IntroTitle>Atticus White</IntroTitle>
        <IntroSubtitle>Software Developer</IntroSubtitle>
        <Row justifyContent="space-around" alignSelf="stretch" marginTop={20}>
          <SocialLink href="https://twitter.com/atticoos">
            <FontAwesome.FaTwitter />
          </SocialLink>
          <SocialLink>
            <FontAwesome.FaGithub />
          </SocialLink>
          <SocialLink>
            <FontAwesome.FaLinkedin />
          </SocialLink>
          <SocialLink>
            <FontAwesome.FaEnvelope />
          </SocialLink>
        </Row>
      </Card>

      {false &&
      <Card marginTop={30} width={500} padding={20} justifyContent="space-around" flexDirection="row">
          <SocialLink href="https://twitter.com/atticoos">
            <FontAwesome.FaTwitter />
          </SocialLink>
          <SocialLink>
            <FontAwesome.FaGithub />
          </SocialLink>
          <SocialLink>
            <FontAwesome.FaLinkedin />
          </SocialLink>
          <SocialLink>
            <FontAwesome.FaEnvelope />
          </SocialLink>
      </Card>
      }
    </Div>
  )
})

return <Decorated />
}

const Card = glamorous.div({
  padding: 40,
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  // background: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 0px 13px 0px rgba(0,0,0,0.25)',
  borderRight: 4
})
Card.propsAreCssOverrides = true

const SocialLink = glamorous(A, {rootEl: 'a'})({
  fontSize: 42,
  color: '#b7b9bb', //Colors.Gray.NORMAL,
  marginLeft: 5,
  marginRight: 5
})

const IntroTitle = glamorous.div({
  fontSize: 62,
  fontWeight: 600,
  marginBottom: 10,
  color: Colors.Blue.NORMAL
})

const IntroSubtitle = glamorous.div({
  fontSize: 32,
  marginBottom: 20,
  color: Colors.Blue.NORMAL
})
