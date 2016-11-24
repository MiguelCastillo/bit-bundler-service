const express = require("express");
const graphqlHTTP = require("express-graphql");
const bundlerSchema = require("./schemas/bundler");
const BundlerService = require("./services/Bundler");

const storage = require("./storage/provider");
const registry = require("./registries/provider");

// Configure storage provider for caching bundles
const StorageProvider = require("./storage/connectors/" + (process.env.BUNDLER_STORAGE || "nedb"));
storage.setProvider(new StorageProvider());

// Configure registry provider to pull npm modules with.
const RegistryProvider = require("./registries/installers/" + (process.env.BUNDLER_INSTALLER || "yarn"));
registry.setProvider(new RegistryProvider());

const app = express();

app
  .use(express.static("cache"))
  .use("/graphql", graphqlHTTP({
    schema: bundlerSchema,
    graphiql: process.env.DEBUG,
    rootValue: {
      bundler: function (options) {
        return new BundlerService(options);
      }
    }
  }));

app.listen(process.env.PORT || 4000);
