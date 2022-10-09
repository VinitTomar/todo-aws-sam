const path = require('path');
const fs = require('fs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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

const layerEntry = fs.readdirSync('./src/util/')
  .reduce((result, curr) => {
    const name = curr.replace('.ts', '');
    const dirName = `layer_${name}/nodejs/node_modules/@util/${name}`;
    result[dirName] = `./src/util/${curr}`;
    return result;
  }, {});

const layerExternals = fs.readdirSync('./src/util')
  .reduce((result, curr) => {
    const name = curr.replace('.ts', '');
    result[`@util/${name}`] = true;
    return result;
  }, {});

module.exports = {
  mode: 'production',
  entry: { ...entry, ...layerEntry },
  target: 'node',
  externals: {
    'aws-sdk/clients/dynamodb': true,
    ...layerExternals
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
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json"
      }),
    ],
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    clean: true
  },
};