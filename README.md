# bit-bundler-service
bit-bundler service


# Usage

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
