import Link from 'next/link'
import Colors from '../../../constants/colors'
import glamorous, {Div, Span} from 'glamorous'
import Row from '../../../components/row'
import A from '../../../components/anchor'
import BottomNav from './bottomNav'
import ColorfulBand from '../../../components/colorfulBand'
import withWindowDimensions from '../../../utils/withWindowDimensions'
import * as FontAwesome from 'react-icons/lib/fa'


export default function Introduction () {
  const Decorated = withWindowDimensions(windowProps => (
    <Div
      height={windowProps.windowHeight || 900}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="transparent"
      zIndex={5}
    >
      <Card width={500}>
        <IntroTitle>Atticus White</IntroTitle>
        <IntroSubtitle>Software Developer</IntroSubtitle>
        <Byline>
          Turning ideas into digital applications
        </Byline>

        <ColorfulBand
          count={10}
          type="dashes"
          opacity={0.75}
          marginTop={40}
          marginBottom={20}
          alignSelf="stretch"
        />

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

      <BottomNav />
    </Div>
  ));

  return (
    <Decorated />
  )
}

const Card = glamorous.div({
  padding: 40,
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.25)',
  borderRight: 4
})
Card.propsAreCssOverrides = true

const SocialLink = glamorous(A)({
  fontSize: 42,
  color: Colors.Black.NORMAL,
  marginLeft: 5,
  marginRight: 5
})
SocialLink.propsAreCssOverrides = true

const IntroTitle = glamorous.div({
  fontSize: 62,
  fontWeight: 600,
  marginBottom: 20,
  color: Colors.Black.NORMAL
})

const IntroSubtitle = glamorous.div({
  fontSize: 32,
  marginBottom: 20,
  color: Colors.Black.NORMAL
})

const Byline = glamorous.div({
  fontSize: 16,
  marginTop: 10,
  marginBottom: 10,
  color: Colors.Black.NORMAL
})
