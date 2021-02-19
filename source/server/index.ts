import path from "path";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import middie from "middie";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { getConfig } from "./config";

const server = fastify();

server.register(fastifyStatic, {
  root: path.join(__dirname, "../../")
});

server.register(middie).then(() => {
  const config = getConfig();
  const compiler = webpack(config);

  server.use(webpackDevMiddleware(compiler, {
    publicPath: "/dist/client",
    stats: {
      all: false,
      colors: true,
      errors: true,
      errorDetails: true,
      warnings: true
    }
  }));
  server.use(webpackHotMiddleware(compiler));

  server.listen(3000).then(() => {
    console.info("Listening at http://localhost:3000/index.html");
  });
});


