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
const port = process.env.PORT || 4000;
const debug = !!process.env.DEBUG;

app
  .use(express.static("cache"))
  .use("/graphql", graphqlHTTP({
    schema: bundlerSchema,
    graphiql: debug,
    rootValue: {
      bundler: function (options) {
        return new BundlerService(options);
      }
    }
  }));

app.listen(port);

console.log("Listening on", port);
