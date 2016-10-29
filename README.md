# bit-bundler-service
bit-bundler service


# Usage

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

Now you can open graphiql (graphical) in your browser with `http://localhost:4000/graphql` and you can run the commands below.


## graphql API

Query to create a bundler

```
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
      "createBundle": "7eb999c44a1db7f7a6355e78af349e35a7df30f51fb93579316b1bdf669d0793"
    }
  }
}
```

Reading the bundle using the ID from the `createBundle` response.

``` javascript
query getBundle {
  bundler {
    getBundle(id: "7eb999c44a1db7f7a6355e78af349e35a7df30f51fb93579316b1bdf669d0793") {
      hash,
      bundle
    }
  }
}
```
