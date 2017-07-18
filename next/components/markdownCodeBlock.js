import React from 'react'
import highlight from 'highlight.js'

export default class CodeBlock extends React.Component {
  componentDidMount() {
    this.highlight()
  }

  componentDidUpate(){
    this.highlight()
  }

  highlight(){
    highlight.highlightBlock(this.refs.code)
  }

  render() {
    return (
      <pre>
        <code
          ref="code"
          className={this.props.language}
        >
          {this.props.literal}
        </code>
      </pre>
    )
  }
}
