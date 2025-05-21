// webpack.server.js
const path = require('path');

module.exports = {
  entry: './src/server/App.js',
  target: 'node',
  externalsPresets: { node: true },
  externals: [/(node_modules|main\..*\.js)/],
  output: {
    path: path.resolve(__dirname, 'build/server'),
    filename: 'App.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      // IGNORE CSS and other style imports
      {
        test: /\.css$/i,
        use: 'null-loader'
      },
      // IGNORE images/fonts if needed
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
        use: 'null-loader'
      },
      // Transpile JS/JSX
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
