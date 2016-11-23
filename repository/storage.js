var _provider;

function setProvider(provider) {
  _provider = provider;
}

function getProvider() {
  return _provider;
}

module.exports = {
  setProvider,
  getProvider
}