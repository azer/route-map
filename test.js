var routeMap = require("./");
var match;

before(function(done){
  match = routeMap({
    '/people/:name': user,
    '/fruits/:fruit': fruit,
    '/fruits/:fruit/:page': fruitPage,
    '/': home
  });
  done();
});

it('returns an object with matching function', function(){
  expect(match('http://foobar.com/people/azer').fn).to.equal(user);
  expect(match('http://localhost/fruits/orange').fn).to.equal(fruit);
  expect(match('http://localhost:8080/fruits/orange/1/').fn).to.equal(fruitPage);
  expect(match('http://localhost/').fn).to.equal(home);
});

it('should return undefined if url doesnt match anything on the table', function(){
  expect(match('http://foobar.com/fruits/orange/1/2')).to.not.exist;
  expect(match('http://localhost/fruits')).to.not.exist
  expect(match('http://localhost:8080/f')).to.not.exist
});

it('should return an object named param with the matching url parts', function(){
  expect(match('http://foobar.com/people/azer').params.name).to.equal('azer');
  expect(match('http://localhost/fruits/orange').params.fruit).to.equal('orange');
  expect(match('http://localhost:8080/fruits/orange/1/').params.fruit).to.equal('orange');
  expect(match('http://localhost:8080/fruits/orange/5/').params.page).to.equal('5');
});

it('should return the matching pattern', function(){
  expect(match('http://foobar.com/people/azer').pattern).to.equal('/people/:name');
});

it('should return url', function(){
  expect(match('http://foobar.com/people/azer?foo=123#bar=qux').url).to.equal('http://foobar.com/people/azer?foo=123#bar=qux');
});

it('should return parsed qs', function(){
  expect(match('http://foobar.com/people/azer?foo=bar&qux=corge').qs.foo).to.equal('bar');
  expect(match('http://foobar.com/people/azer?foo=bar&qux=corge#qux=eggs').qs.qux).to.equal('corge');
});

function home () {}
function user () {}
function fruit () {}
function fruitPage () {}
