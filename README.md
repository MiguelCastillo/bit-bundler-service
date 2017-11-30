# bit-bundler-service

[![Greenkeeper badge](https://badges.greenkeeper.io/MiguelCastillo/bit-bundler-service.svg)](https://greenkeeper.io/)
[bit-bundler](https://github.com/MiguelCastillo/bit-bundler) web service with a graphql API.

The service allows you to specify a list of npm modules, optionally with specific versions, and bundle them. The bundles are minified and generated along with a sourcemap file.

Some of the goals are to:

- Bundle github projects
- Bundle splitting
- Babel integration
- Siren hypermedia responses
- Webhooks to notify when bundles are ready, and more...

> This is just an experiment for integrating graphql with bit-bundler.


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!--   *generated with [DocToc](https://github.com/thlorenz/doctoc)* -->

- [Usage](#usage)
  - [requirements](#requirements)
  - [Install](#install)
  - [Start server with default values](#start-server-with-default-values)
  - [options](#options)
    - [DEBUG](#debug)
    - [PORT](#port)
  - [Running the service with graphiql enabled](#running-the-service-with-graphiql-enabled)
  - [graphql API](#graphql-api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Usage

## requirements

- node 6. Code is written using features available.


## Install

```
$ git clone https://github.com/MiguelCastillo/bit-bundler-service.git
$ cd bit-bundler-service
$ npm install
```

## Start server with default values

```
$ npm start
```


## options

### DEBUG

Flag to enable graphiql.

```
$ DEBUG=true node index.js
```

### PORT

Port to be used for starting the webserver

```
$ PORT=2015 node index.js
```

## Running the service with graphiql enabled

```
$ DEBUG=true node index.js
```

Now you can open graphiql (graphical) in your browser with [http://localhost:4000/graphql](http://localhost:4000/graphql) and you can run the commands below.


## graphql API

Query to create a bundle - [link](http://localhost:4000/graphql?query=query%20bundler(%24modules%3A%20%5BModule%5D)%20%7B%0A%20%20bundler%20%7B%0A%20%20%20%20createBundle(modules%3A%20%24modules)%0A%20%20%7D%0A%7D%0A&variables=%7B%0A%20%20%22modules%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22name%22%3A%20%22spromise%22%2C%0A%20%20%20%20%20%20%22version%22%3A%20%22%5E1.0.0%22%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D)

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

Reading the bundle using the ID from the `createBundle` response. [link](http://localhost:4000/graphql?variables=&query=query%20getBundle%20%7B%0A%20%20bundler%20%7B%0A%20%20%20%20getBundle(id%3A%20%22e91671086147d525a5887479b9ad6bfd02f0d1ad%22)%20%7B%0A%20%20%20%20%20%20hash%0A%20%20%20%20%20%20bundle%0A%20%20%20%20%20%20sourcemap%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&operationName=getBundle)

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
