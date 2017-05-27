import Link from 'next/link'
import glamorous, {Div, Img, Span} from 'glamorous'
import A from './anchor';
import Row from './row'
import Colors from '../constants/colors'

export default function NavBar () {
  return (
    <Container>
      <Wrapper>
        <ProfilePicture />
        <NavLinks />
        <ProfilePicture />
      </Wrapper>
    </Container>
  );
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
      <NavLink href='/hello'>Blog</NavLink>
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
  backgroundColor: Colors.White.NORMAL,
  paddingLeft: 20,
  paddingRight: 20,
  height: 70,
  top: 0,
  left: 0,
  right: 0
});

const Container = glamorous.div({
  height: 70,
  zIndex: 10
})

