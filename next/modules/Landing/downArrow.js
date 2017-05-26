import React from 'react'
import glamorous from 'glamorous'
import {css} from 'glamor'

export default ({color, size}) => (
  <Container size={size - (size * 0.2)}>
    <Edge color={color} size={size} left />
    <Edge color={color} size={size} right />
  </Container>
)

let bounce = css.keyframes({
  '0%': { transform: 'scale(1)', opacity: .6 },
  '60%': { transform: 'scale(1.2)', opacity: 1 },
  '100%': { transform: 'scale(1)', opacity: 0.6}
})

const Container = glamorous.view({
  position: 'relative',
  animation: `${bounce} 2s infinite`
}, props => ({
  width: props.size,
  height: props.size
}))

const Edge = glamorous.view({
  position: 'absolute',
  width: 3
}, props => ({
  height: props.size,
  left: props.left ? 0 : null,
  right: props.right ? 0 : null,
  backgroundColor: props.color,
  transform: `rotate(${props.left ? '-' : ''}45deg)`
}))
