import React from 'react'

const isClient = typeof window !== 'undefined'

export default function withWindowDimensions (WrappedComponent) {
  return class Provider extends React.Component {
    state = {
      width: isClient ? window.innerWidth : null,
      height: isClient ? window.innerHeight : null
    }

    constructor(props) {
      super(props)
      this.onResize = this.onResize.bind(this)
    }

    componentDidMount() {
      if (isClient) {
        this.resizeListener = window.addEventListener('resize', this.onResize)
      }
    }

    componentWillUnmount() {
      if (isClient) {
        window.removeEventListener('resize', this.onResize)
      }
    }

    onResize() {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    render() {
      console.log('WINDOW', this.state)
      return (
        <WrappedComponent
          windowHeight={this.state.height}
          windowWidth={this.state.width}
        />
      )
    }
  }
}
