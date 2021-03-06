'use strict';

var fs = require('fs');
var grunt = require('grunt');
var path = require('path');

var TEST_GRUNTFILE = 'test/fixtures/grunt-task/gruntfile.js';

module.exports = {
  'grunt-task': {
    options: {
      src: {
        'is required': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:srcRequired'
            ]
          }, function (err, result) {
            test.equals(result.code, 6, 'Should exit with `Warning` exit code');
            test.ok(
              result.stdout.indexOf('`src` is required') !== -1,
              'Should complain about missing `src` option'
            );
            test.done();
          });
        },
        'entries are built into the bundle': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:srcEntriesBuilt'
            ]
          }, function (err, result) {
            if (err) {
              return test.done(err);
            }

            test.equals(result.code, 0, 'Should exit without errors');

            var expectedOne =
              fs.readFileSync('./test/fixtures/grunt-task/app-one.js', {
                encoding: 'utf8'
              });
            var expectedTwo =
              fs.readFileSync('./test/fixtures/grunt-task/app-two.js', {
                encoding: 'utf8'
              });
            var actual =
              fs.readFileSync('./test/scratch/src-entries-built-actual.js', {
                encoding: 'utf8'
              });

            test.
              ok(actual.indexOf(expectedOne) >= 0, 'should contain app-one.js');
            test.
              ok(actual.indexOf(expectedTwo) >= 0, 'should contain app-two.js');
            test.done();
          });
        }
      },

      dest: {
        'defaults to `grunt/base/path/scout.js`': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:destDefaultsToCWD'
            ]
          }, function (err, result) {
            test.equals(result.code, 0, 'Should exit without errors');

            var expected = path.dirname(TEST_GRUNTFILE) + '/scout.js';
            test.ok(
              fs.existsSync(expected),
              'should output bundle as `' + expected + '`'
            );

            fs.unlink(expected);
            test.done();
          });
        },
        'bundle written': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:destBundleWritten'
            ]
          }, function (err, result) {
            test.equals(result.code, 0, 'Should exit without errors');

            var expected = './test/scratch/src-entries-built-actual.js';
            test.ok(
              fs.existsSync(expected),
              'should output bundle as `' + expected + '`'
            );

            test.done();
          });
        },
      },

      stdout: {
        'prints webpack stdout on success': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:stdoutPrintedSuccess'
            ]
          }, function (err, result) {
            test.ok(
              result.stdout.indexOf('stdout-written-success-actual.js') > -1,
              'stdout should include webpack output'
            );

            test.done();
          });
        },
        'prints webpack stdout on failure': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:stdoutPrintedFailure'
            ]
          }, function (err, result) {
            test.ok(
              result.stdout.indexOf('Module not found: Error') > -1 &&
                result.stdout.indexOf('no-such-module') > -1,
              'stdout should include webpack output'
            );

            test.done();
          });
        }
      },

      exitcode: {
        'exits 0 on success': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:exitcodeSuccess'
            ]
          }, function (err, result) {
            test.equals(result.code, 0, 'Should exit without errors');

            test.done();
          });
        },
        'exits non-zero on failure': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:exitcodeFailure'
            ]
          }, function (err, result) {
            test.ok(result.code !== 0, 'Should exit with an error');

            test.done();
          });
        }
      },

      namespace: {
        'includes specified namespace': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:namespace'
            ]
          }, function (err) {
            if (err) {
              return test.done(err);
            }

            var actual = fs.readFileSync('./test/scratch/namespace-actual.js', {
              encoding: 'utf8'
            });

            test.
              ok(actual.indexOf('NAMESPACE') >= 0, 'should contain namespace');
            test.done();
          });
        }
      },

      appConfig: {
        'includes specified app config': function (test) {
          grunt.util.spawn({
            grunt: true,
            args: [
              '--gruntfile=' + TEST_GRUNTFILE,
              '--no-color',
              'scoutfile:appConfig'
            ]
          }, function (err) {
            if (err) {
              return test.done(err);
            }

            var actual = fs.readFileSync('./test/scratch/appConfig-actual.js', {
              encoding: 'utf8'
            });

            test.ok(actual.indexOf('{"it":"works"}') >= 0,
              'should contain app config');

            test.done();
          });
        }
      }
    }
  }
};
