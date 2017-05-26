import React from 'react'
import glamorous, {Div} from 'glamorous'
import _ from 'lodash'

var COLORS = ['#FF9900', '#424242', '#BCBCBC', '#3299BB'];

export default ({count, type, ...rest}) => (
  <Container {...rest}>
    {Array.from(Array(count)).map((n, i) => (
      <BandItem
        key={i}
        type={type}
        color={COLORS[i % COLORS.length]}
      />
    ))}
  </Container>
)

function BandItem ({type, color}) {
  if (type === 'dashes') {
    return <Dash color={color} />
  }
  return <Dot color={color} />
}

function Dot ({color}) {
  const rotation = _.random(0, 15)
  const direction = _.random(0, 1) === 1 ? -1 : 1;

  const size = 12;

  const margin = _.random(0, 8) * (_.random(0, 1) ? -1 : 1)

  return (
    <Div
      backgroundColor={color}
      marginRight={5}
      marginLeft={5}
      height={size}
      width={size}
      borderRadius={size / 2}
    />
  )
}

function Dash ({color}) {
  const rotation = _.random(0, 15)
  const direction = _.random(0, 1) === 1 ? -1 : 1;
  const size = 12;

  return (
    <Div
      backgroundColor={color}
      marginRight={5}
      marginLeft={5}
      flex={1}
      height={size}
      borderRadius={size / 2}
      transform={`rotate(${rotation * direction}deg)`}
    />
  )
}

const Container = glamorous.view({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
})
Container.propsAreCssOverrides = true
