const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const dependencies = require("../package.json").dependencies;

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath:"/container/latest/"
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        app1: `app1@${domain}/app1/remoteEntry.js`,
        app2: `app2@${domain}/app2/remoteEntry.js`,
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          eager: true,
          requiredVersion: dependencies["react"],
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
