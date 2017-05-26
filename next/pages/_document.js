import 'glamor/reset'
import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import {renderStatic} from 'glamor/server'

export default class MyDcoument extends Document {
  static async getInitialProps({renderPage, ...rest}) {
    const page = renderPage()
    const styles = renderStatic(() => page.html)
    return {...page, ...styles}
  }

  constructor(props) {
    super(props)
    const {__NEXT_DATA__, ids} = props
    if (ids) {
      __NEXT_DATA__.ids = this.props.ids
    }
  }

  render() {
    return (
      <html>
        <Head>
          <title>Atticus White</title>
          <style dangerouslySetInnerHTML={{__html: this.props.css}} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
