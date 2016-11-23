# bit-bundler-service
[bit-bundler](https://github.com/MiguelCastillo/bit-bundler) web service with a graphql API.

The service allows you to specify a list of npm modules, optionally with specific versions, and bundle them. The bundles are minified and generated along with a sourcemap file.

Some of the goals are to:

- Bundle github projects
- Bundle splitting
- Babel integration
- Siren hypermedia responses
- Webhooks to notify when bundles are ready, and more...

> This is just an experiment for integrating graphql with bit-bundler.

# Usage

## requirements

- node 6. Code is written using features available.


## Install

```
$ git clone https://github.com/MiguelCastillo/bit-bundler-service.git
$ cd bit-bundler-service
$ npm install
```

## Running the service with graphiql enabled

```
$ debug=true node index.js
```

Now you can open graphiql (graphical) in your browser with [http://localhost:4000/graphql](http://localhost:4000/graphql) and you can run the commands below.


## graphql API

Query to create a bundle

``` javascript
query bundler($modules: [Module]) {
  bundler {
    createBundle(modules: $modules)
  }
}
```

Query variables

``` javascript
{
  "modules": [
    {
      "name": "spromise",
      "version": "^1.0.0"
    }
  ]
}
```

Response with the ID you use for reading the bundle

``` javascript
{
  "data": {
    "bundler": {
      "createBundle": "e91671086147d525a5887479b9ad6bfd02f0d1ad"
    }
  }
}
```

Reading the bundle using the ID from the `createBundle` response.

``` javascript
query getBundle {
  bundler {
    getBundle(id: "e91671086147d525a5887479b9ad6bfd02f0d1ad") {
      hash,
      bundle,
      sourcemap
    }
  }
}
```
