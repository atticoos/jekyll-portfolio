import React from 'react'
import glamorous, {View} from 'glamorous'
import A from '../../../components/anchor'
import Colors from '../../../constants/colors'
import DownArrow from './downArrow'

export default ({style}) => (
  <Container style={style}>
    <NavItem>Projects</NavItem>
    <NavItem>Labs</NavItem>
    <DownArrow color={Colors.Blue.NORMAL} size={20} />
    <NavItem>Writing</NavItem>
    <NavItem>Contact</NavItem>
  </Container>
)

const Container = glamorous.div({
  height: 70,
  borderTopColor: Colors.Gray.LIGHT,
  borderTopWidth: 2,
  borderTopStyle: 'solid',
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  position: 'absolute',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  left: 0,
  right: 0,
  bottom: 0
})

const NavItem = glamorous(A, {rootEl: 'a'})({
  fontSize: 24,
  color: Colors.Gray.NORMAL
})
