module.exports = {
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    config.module.rules.push(
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader']
      }
    )

    return config
  }
}
