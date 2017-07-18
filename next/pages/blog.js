import Link from 'next/link'
import Markdown from 'react-markdown'
import glamorous, {Div} from 'glamorous'
import Head from '../components/head'
import NavBar from '../components/navbar'
import CodeBlock from '../components/markdownCodeBlock'
import Colors from '../constants/colors'
// import markdownCodeHighlightStylesheet from 'highlight.js/styles/github.css'

const isClient = typeof window !== 'undefined'

const md = `

# A blog post

This is a blog post

> this is a comment

_this is italics_

## A subtitle

\`\`\`js
var foo = 'bar'
\`\`\`

More text

`;

export default () => (
  <div>
    <Head title="Blog" />

    {isClient && <style dangerouslySetInnerHTML={{__html: require('highlight.js/styles/github.css')}} />}

    <Markdown
      source={md}
      renderers={{...Markdown.renderers, CodeBlock}}
    />
  </div>
)
