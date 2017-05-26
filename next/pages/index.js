import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import NavBar from '../components/navbar'
import Colors from '../constants/colors'
import glamorous, {Div, Span} from 'glamorous'
import Row from '../components/row'
import A from '../components/anchor'
import Landing from '../modules/Home/Landing';
import ScrollReveal from '../modules/behavioral/scrollReveal'
import withWindowDimensions from '../utils/withWindowDimensions'
import * as FontAwesome from 'react-icons/lib/fa'


const isClient = typeof window !== 'undefined'


export default () => (
  <div>
    <Head title="Home" />

    {isClient && <DotCanvas />}
      <Div
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        left={0}
        backgroundColor="rgba(255,255,255,0.75)"
        zIndex={1}
        filter="blur(20px)"
      />
    <Div position="relative" backgroundColor="transparent" zIndex={2}>
      <Landing />

      <ScrollReveal position={isClient ? window.innerHeight : 900}>
        <NavBar />
      </ScrollReveal>


      <Div height={900} backgroundColor="gray" marginVertical={10} />
      <Div height={900} backgroundColor="lightgray" marginVertical={10} />
      <Div height={900} backgroundColor="gray" marginVertical={10} />
    </Div>
  </div>
)

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
