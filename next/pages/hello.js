import Link from 'next/link';
import Head from '../components/head'

export default (props) => {
  return (
  <div>
    <Head title="Hello" />
    Hello World. <Link href="/foo"><a>Foo</a></Link>
  </div>
)
}
