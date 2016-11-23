const express = require("express");
const graphqlHTTP = require("express-graphql");
const bundlerSchema = require("./schemas/bundler");
const BundlerService = require("./services/Bundler");

const storage = require("./storage/provider");
const registry = require("./registries/provider");

// Configure storage provider for caching bundles
const StorageProvider = require("./storage/connectors/" + (process.env.storage || "nedb"));
storage.setProvider(new StorageProvider());

// Configure registry provider to pull npm modules with.
const RegistryProvider = require("./registries/providers/" + (process.env.registry || "npm"));
registry.setProvider(new RegistryProvider());

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
