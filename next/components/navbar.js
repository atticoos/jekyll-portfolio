import Link from 'next/link'
import glamorous, {Div, Img, Span} from 'glamorous'
import {Motion, spring} from 'react-motion'
import A from './anchor';
import Row from './row'
import Colors from '../constants/colors'


export default class NavBar extends React.Component {
  state = {
    animateIn: false
  }

  componentDidMount() {
    this.setState({
      animateIn: true
    })
  }

  render() {
    return (
      // <Container>
      <Motion style={{y: spring(this.state.animateIn ? 0 : -70)}}>
        {({y}) => (
          <Wrapper style={{
            transform: `translate(0, ${y}px)`
          }}>
            <ProfilePicture />
            <NavLinks />
            <ProfilePicture />
          </Wrapper>
        )}
      </Motion>
      // </Container>
    );
  }
}

function ProfilePicture () {
  return (
    <Row>
      <Img
        src="http://atticuswhite.com/dist/images/me.jpeg"
        height={40}
        width={40}
        marginRight={10}
      />
      <Div>
        <Span color={Colors.Gray.NORMAL}>Atticus White</Span><br/>
        <Span color={Colors.Gray.NORMAL}>@atticoos</Span>
      </Div>
    </Row>
  )
}

function NavLinks () {
  return (
    <Row>
      <NavLink href='/'>Home</NavLink>
      <NavLink href='/hello'>Portfolio</NavLink>
      <NavLink href='/hello'>Labs</NavLink>
      <NavLink href='/blog'>Writing</NavLink>
    </Row>
  )
}

const NavLink = glamorous(
  ({href, ...rest}) => <Link href={href}><A {...rest} /></Link>,
  {rootEl: 'a'}
)({
  fontSize: 18,
  marginRight: 20,
  marginLeft: 20,
  color: Colors.Gray.NORMAL
});

const Wrapper = glamorous.div({
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(255,255,255,0.95)', //Colors.White.NORMAL,
  // borderBottomColor: Colors.Gray.LIGHT,
  // borderBottomWidth: 1,
  // borderBottomStyle: 'solid',
  boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.3)',
  paddingLeft: 20,
  paddingRight: 20,
  height: 70,
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10
});

const Container = glamorous.div({
  height: 70,
  zIndex: 10
})

