const path = require('path');
const fs = require('fs');

const entry = fs.readdirSync('./src/')
  .filter(file => (file.endsWith('.ts')
    && !file.endsWith('.d.ts')
    && !file.includes('util'))
  )
  .reduce((result, curr) => {
    const name = curr.replace('.ts', '');
    result[name] = './src/' + curr;
    return result;
  }, {});


module.exports = {
  mode: 'production',
  entry,
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
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    clean: true
  },
};