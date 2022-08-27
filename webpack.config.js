const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.ts',
  },
  target: 'node',
  externals: {
    'aws-sdk/clients/dynamodb': true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    clean: true
  },
};