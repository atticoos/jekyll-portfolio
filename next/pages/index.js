import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import NavBar from '../components/navbar'
import Colors from '../constants/colors'
import glamorous, {Div, Span} from 'glamorous'
import Row from '../components/row'
import A from '../components/anchor'
import Landing from '../modules/Landing';
import withWindowDimensions from '../utils/withWindowDimensions'
import * as FontAwesome from 'react-icons/lib/fa'


const isClient = typeof window !== 'undefined'


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

export default () => (
  <div>
    <Head title="Home" />

    {isClient && <DotCanvas />}
    <Div position="relative" backgroundColor="transparent" zIndex={2}>
      {false && <NavBar />}

      <Landing />


      <Div height={900} backgroundColor="gray" marginVertical={10} />
      <Div height={900} backgroundColor="lightgray" marginVertical={10} />
      <Div height={900} backgroundColor="gray" marginVertical={10} />
    </Div>
  </div>
)
