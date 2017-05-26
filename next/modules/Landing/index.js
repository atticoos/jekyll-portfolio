import Link from 'next/link'
import Colors from '../../constants/colors'
import glamorous, {Div, Span} from 'glamorous'
import Row from '../../components/row'
import A from '../../components/anchor'
import BottomNav from './bottomNav'
import withWindowDimensions from '../../utils/withWindowDimensions'
import * as FontAwesome from 'react-icons/lib/fa'


export default function Introduction () {
  const Decorated = withWindowDimensions(windowProps => (
    <Div
      height={windowProps.windowHeight}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="transparent"
    >
      <Card width={500}>
        <IntroTitle>Atticus White</IntroTitle>
        <IntroSubtitle>Software Developer</IntroSubtitle>
        <Byline>
          Turning ideas into digital application
        </Byline>
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
  boxShadow: '0px 0px 13px 0px rgba(0,0,0,0.25)',
  borderRight: 4
})
Card.propsAreCssOverrides = true

const SocialLink = glamorous(A)({
  fontSize: 42,
  color: Colors.Gray.LIGHT,
  marginLeft: 5,
  marginRight: 5
})
SocialLink.propsAreCssOverrides = true

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

const Byline = glamorous.div({
  fontSize: 16,
  marginTop: 10,
  marginBottom: 10,
  color: Colors.Gray.NORMAL
})
