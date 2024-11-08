const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dependencies = require("./package.json").dependencies;

const PORT = 8080;

module.exports = {
    mode:"development",
  entry: path.resolve(__dirname, "./src/index.js"),
  devServer: {
    static: path.join(__dirname, "dist"),
    port: PORT,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      // Middleware to catch URI errors
      devServer.app.use((req, res, next) => {
        try {
          decodeURIComponent(req.path);
        } catch (e) {
          console.error("Malformed URI caught:", req.path);
          res.status(400).send("Bad Request");
          return;
        }
        next();
      });

      return middlewares;
    },
  },
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'file-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
       app1: "app1@http://localhost:8081/remoteEntry.js",
       app2: "app2@http://localhost:8082/remoteEntry.js",
      },
      filename: "remoteEntry.js",
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
    new HtmlWebpackPlugin({
      manifest: "./public/manifest.json",
      favicon: "./public/favicon.ico",
      template: "./public/index.html",
    }),
  ],
};