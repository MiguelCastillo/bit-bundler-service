const express = require("express");
const graphqlHTTP = require("express-graphql");
const bundlerSchema = require("./schemas/bundler");
const BundlerService = require("./services/Bundler");
const repositoryStorage = require("./repository/storage");
const nedbAdapter = require("./repository/connectors/nedb");

repositoryStorage.setProvider(new nedbAdapter());

// The root provides the top-level API endpoints
var root = {
  bundler: function (options) {
    return new BundlerService(options);
  }
}

const app = express();

app
  .use(express.static("cache"))
  .use("/graphql", graphqlHTTP({
    schema: bundlerSchema,
    graphiql: process.env.debug,
    rootValue: root
  }));

app.listen(4000);
