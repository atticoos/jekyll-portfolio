import React from 'react'

const isClient = typeof window !== 'undefined'

const getScrollY = () => {
  if (window.pageYOffset !== undefined) {
    return window.pageYOffset
  } else if (window.scrollTop !== undefined) {
    return window.scrollTop
  } else {
    return (document.documentElement || document.body.parentNode || document.body).scrollTop
  }
}

export default class ScrollReveal extends React.Component {
  static propTypes = {

  }
  state = {
    visible: false
  }

  constructor(props) {
    super(props)
    this.listener = null
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount() {
    if (isClient) {
      window.addEventListener('scroll', this.onScroll)
      this.onScroll()
    }
  }

  componentWillUnmount() {
    if (isClient) {
      window.removeEventListener('scroll', this.onScroll)
    }
  }

  onScroll () {
    const position = getScrollY()

    if (position >= this.props.position && !this.state.visible) {
      this.setState({visible: true})
    } else if (position < this.props.position && this.state.visible) {
      this.setState({visible: false})
    }
  }

  render() {
    if (this.state.visible) {
      return React.Children.only(this.props.children)
    }
    return null
  }
}
