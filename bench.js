
var max = 1000000
var parallel = require('./')()
var parallelNoResults = require('./')({ results: false })
var async = require('async')
var obj = {}

function bench (func, done) {
  var key = max + '*' + func.name
  var count = -1

  console.time(key)
  end()

  function end() {
    if (++count < max) {
      func(end)
    } else {
      console.timeEnd(key)
      if (done) {
        done()
      }
    }
  }
}

function benchFastParallel(done) {
  parallel({}, [somethingP, somethingP, somethingP], 42, done)
}

function benchFastParallelNoResults(done) {
  parallelNoResults({}, [somethingP, somethingP, somethingP], 42, done)
}

function benchFastParallelEach(done) {
  parallelNoResults({}, somethingP, [1, 2, 3], done)
}

function benchFastParallelEachResults(done) {
  parallel({}, somethingP, [1, 2, 3], done)
}

function benchAsyncParallel(done) {
  async.parallel([somethingA, somethingA, somethingA], done)
}

function benchAsyncEach(done) {
  async.each([1, 2, 3], somethingP, done)
}

function benchAsyncMap(done) {
  async.map([1, 2, 3], somethingP, done)
}

var nextDone;
var nextCount;

function benchSetImmediate(done) {
  nextCount = 3
  nextDone = done
  setImmediate(somethingImmediate)
  setImmediate(somethingImmediate)
  setImmediate(somethingImmediate)
}

function somethingImmediate() {
  nextCount--
  if (nextCount === 0) {
    nextDone()
  }
}

function somethingP(arg, cb) {
  setImmediate(cb)
}

function somethingA(cb) {
  setImmediate(cb)
}

async.eachSeries([
  benchFastParallel,
  benchFastParallelNoResults,
  benchAsyncParallel,
  benchSetImmediate,
  benchFastParallelEach,
  benchFastParallelEachResults,
  benchAsyncEach,
  benchAsyncMap,
], bench)
