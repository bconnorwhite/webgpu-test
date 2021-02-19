import { join } from "path";
import webpack, { Configuration } from "webpack";

export function getConfig(): Configuration {
  return {
    entry: {
      main: [
        join(__dirname, "../client/index.js"),
        "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&noInfo=true"
      ]
    },
    resolve: {
      extensions: [".js"]
    },
    mode: "development",
    module: {
      rules: [{
        test: /\.js?$/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env", {
                  loose: true,
                  exclude: [
                    "@babel/plugin-transform-regenerator"
                  ]
                }
              ]
            ]
          }
        }]
      }]
    },
    output: {
      path: join(__dirname, "../../dist/client"),
      filename: "bundle.js",
      publicPath: "dist/client"
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin({
        resourceRegExp: /(.)+(\.d\.ts)|(.)+(\.graphql)$/u
      })
    ]
  }
}
