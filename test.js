var test = require('prova');
var routeMap = require("./");

var match = routeMap({
  '/people/:name': user,
  '/fruits/:fruit': fruit,
  '/fruits/:fruit/:page': fruitPage,
  '/:with.:dots,:and;:commas': dots,
  '/': home
});

test('returns an object with matching function', function (t) {
  t.equal(match('http://foobar.com/people/azer').fn, user);
  t.equal(match('http://localhost/fruits/orange').fn, fruit);
  t.equal(match('http://localhost:8080/fruits/orange/1/').fn, fruitPage);
  t.equal(match('http://localhost/').fn, home);
  t.deepEqual(match('http://localhost/fruits/orange/1').keys.map(function (el) { return el.name; }), ['fruit', 'page']);
  t.end();
});

test('should return undefined if url doesnt match anything on the table', function (t) {
  t.notOk(match('http://foobar.com/fruits/orange/1/2'));
  t.notOk(match('http://localhost/fruits'));
  t.notOk(match('http://localhost:8080/f'));
  t.end();
});

test('should return an object named param with the matching url parts', function (t) {
  t.equal(match('http://foobar.com/people/azer').params.name, 'azer');
  t.equal(match('http://localhost/fruits/orange').params.fruit, 'orange');
  t.equal(match('http://localhost:8080/fruits/orange/1/').params.fruit, 'orange');
  t.equal(match('http://localhost:8080/fruits/orange/5/').params.page, '5');
  t.end();
});

test('should return the matching pattern', function (t) {
  t.equal(match('http://foobar.com/people/azer').pattern, '/people/:name');
  t.end();
});

test('should return url', function (t) {
  t.equal(match('http://foobar.com/people/azer?foo=123#bar=qux').url, 'http://foobar.com/people/azer?foo=123#bar=qux');
  t.end();
});

test('should return parsed qs', function (t) {
  t.equal(match('http://foobar.com/people/azer?foo=bar&qux=corge').qs.foo, 'bar');
  t.equal(match('http://foobar.com/people/azer?foo=bar&qux=corge#qux=eggs').qs.qux, 'corge');
  t.end();
});

test('with dots and commas', function (t) {
  t.deepEqual(match('http://foo/lorem.ipsum,sit;dolor').params, {
    'with': 'lorem',
    'dots': 'ipsum',
    'and': 'sit',
    'commas': 'dolor'
  });
  t.end();
});

function home () {}
function user () {}
function fruit () {}
function fruitPage () {}
function dots () {}
