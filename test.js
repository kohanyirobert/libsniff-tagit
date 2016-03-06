var assert = require('chai').assert
var tmp = require('tmp')
var path = require('path')
var download = require('./')
var pkg = require('./package.json')

var THIRTY_SECONDS = 30 * 1000

describe(pkg.name, function() {
  it('should download the specfied targets', function(done) {
    this.timeout(THIRTY_SECONDS)
    tmp.dir({unsafeCleanup: true}, function(err, tmpDir) {
      var options = {
        dir: tmpDir,
        targets: [
          'linux-ia32',
          'win32-x64'
        ]
      }
      download(options, function(downloads) {
        assert(downloads)
        assert(downloads.length === options.targets.length)
        downloads.forEach(function(download) {
          assert(options.targets.indexOf(download.target) > -1)
          assert(download.files.length === 1)
          download.files.forEach(function(file) {
            var destPath = path.resolve(path.join(options.dir, download.target))
            assert(file.indexOf(destPath) === 0)
            assert(file.indexOf('tagit') > -1)
          })
        })
        done()
      })
    })
  })
})
