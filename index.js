var parseUrl = require("url").parse;
var parseQS = require("querystring").parse;
var pathToRegexp = require("path-to-regexp");

module.exports = routeMap;

function routeMap (routes) {
  var map = {};

  var pattern, keys;
  for (pattern in routes) {
    keys = [];
    map[pattern] = {
      keys: keys,
      exp: pathToRegexp(pattern, keys)
    };
  }

  return match;

  function match (fullUrl) {
    var url = parseUrl(fullUrl);
    var result_default = {
      url: fullUrl,
      hash: url.hash,
      qs: url.query,
      params: {},
      keys: keys
    };

    var results = [];
    var pattern, match, i;
    for (pattern in map) {
      match = url.pathname.match(map[pattern].exp);

      if (!match) continue;

      var result = Object.create(result_default);
      result.pattern = pattern;
      result.fn = routes[pattern];
      result.keys = map[pattern].keys;

      if (result.qs) {
        result.qs = parseQS(result.qs);
      }

      i = map[pattern].keys.length;
      while (i--) {
        result.params[ map[pattern].keys[i].name ] = match[i+1];
      }

      results.push(result);
    }

    return results

}

}
