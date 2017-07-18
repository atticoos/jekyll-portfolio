'use strict';

import glamorous from 'glamorous'
import Colors from '../../constants/colors';
import Circle from '../Shapes/circle';

export default function WebPreview ({children, ...props}) {
  return (
    <Container {...props}>
      <Header>
        <Circle
          size={15}
          color={Colors.Gray.NORMAL}
          marginRight={10}
        />
        <Circle
          size={15}
          color={Colors.Gray.NORMAL}
          marginRight={10}
        />
        <Circle
          size={15}
          color={Colors.Gray.NORMAL}
        />
      </Header>
      <Content>
        {children}
      </Content>
    </Container>
  )
}

const Container = glamorous.div({
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  backgroundColor: 'darkgray',
  overflow: 'hidden'
})
Container.propsAreCssOverrides = true

const Header = glamorous.div({
  backgroundColor: '#e0e2e4',
  padding: 15,
  display: 'flex',
  flexDirection: 'row'
})

const Content = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})
