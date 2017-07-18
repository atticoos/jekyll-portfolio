import glamorous from 'glamorous';
import Colors from '../../constants/colors';

const Direction = {
  DOWN: 'down',
  UP: 'up'
};

export default function Arrow ({
  size = 30,
  direction = Direction.DOWN,
  color = Colors.Blue.NORMAL,
  ...props
}) {
  return (
    <Container
      width={size - 8}
      height={size - 3}
      {...props}
    >
      <Line
        tilt={-40}
        left={0}
        height={size}
        backgroundColor={color}
      />
      <Line
        tilt={40}
        right={0}
        height={size}
        backgroundColor={color}
      />
    </Container>
  )
}

Arrow.Direction = Direction;

const Container = glamorous.div({
  position: 'relative'
})
Container.propsAreCssOverrides = true

const Line = glamorous.div(
  {
    position: 'absolute',
    width: 4,
    backgroundColor: 'red'
  },
  ({tilt}) => ({
    transform: `rotate(${tilt}deg)`
  })
)
Line.propsAreCssOverrides = true
