import React from 'react'

export default class WaveCanvas extends React.Component {
  componentDidMount() {
    if (!this.loaded) {
      require('./waves').default();
    }
    this.loaded = true
  }

  render() {
    return (
      <Div
        className="wave-canvas"
        backgroundColor="transparent"
        height={300}
      />
    )
  }
}
