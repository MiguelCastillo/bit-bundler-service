const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  input Module {
    name: String!
    version: String
  }

  type Result {
    id: String!
    hash: String
    bundle: String
    sourceMap: String
  }

  type Bundler {
    createBundle(modules: [Module]): String
    getBundle(id: String) : Result
  }

  type Query {
    bundler: Bundler
  }
`);
