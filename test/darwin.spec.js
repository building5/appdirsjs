// Copyright (c) 2014. David M. Lee, II.
/* global before, after, describe, it */
/* jshint expr:true */
'use strict';

var appdirs = require('..'),
    chai = require('chai'),
    expect = chai.expect;

chai.config.includeStack = true;

describe('AppDirs on Mac', function () {
  var homeOrig,
      uut = appdirs.darwin;

  before(function () {
    homeOrig = process.env.HOME;
    process.env.HOME = '/Users/fake-home';
  });

  after(function () {
    process.env.HOME = homeOrig;
  });

  describe('userDataDir', function () {
    it('should default to ~/Library/Application Support', function () {
      expect(uut.userDataDir()).to.equal(
          '/Users/fake-home/Library/Application Support');
    });
    it('should include appname', function () {
      expect(uut.userDataDir('someApp')).to.equal(
          '/Users/fake-home/Library/Application Support/someApp');
    });
    it('should include version', function () {
      expect(uut.userDataDir('someApp', null, '3.1')).to.equal(
          '/Users/fake-home/Library/Application Support/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userDataDir(null, null, '3.1')).to.equal(
          '/Users/fake-home/Library/Application Support');
    });
  });

  describe('userConfigDir', function () {
    it('should default to ~/Library/Application Support', function () {
      expect(uut.userConfigDir()).to.equal(
          '/Users/fake-home/Library/Application Support');
    });
    it('should include appname', function () {
      expect(uut.userConfigDir('someApp')).to.equal(
          '/Users/fake-home/Library/Application Support/someApp');
    });
    it('should include version', function () {
      expect(uut.userConfigDir('someApp', null, '3.1')).to.equal(
          '/Users/fake-home/Library/Application Support/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userConfigDir(null, null, '3.1')).to.equal(
          '/Users/fake-home/Library/Application Support');
    });
  });

  describe('userCacheDir', function () {
    it('should default to ~/Library/Caches', function () {
      expect(uut.userCacheDir()).to.equal(
          '/Users/fake-home/Library/Caches');
    });
    it('should include appname', function () {
      expect(uut.userCacheDir('someApp')).to.equal(
          '/Users/fake-home/Library/Caches/someApp');
    });
    it('should include version', function () {
      expect(uut.userCacheDir('someApp', null, '3.1')).to.equal(
          '/Users/fake-home/Library/Caches/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userCacheDir(null, null, '3.1')).to.equal(
          '/Users/fake-home/Library/Caches');
    });
  });

  describe('siteDataDir', function () {
    it('should default to /Library/Application Support', function () {
      expect(uut.siteDataDir()).to.equal(
          '/Library/Application Support');
    });
    it('should include appname', function () {
      expect(uut.siteDataDir('someApp')).to.equal(
          '/Library/Application Support/someApp');
    });
    it('should include version', function () {
      expect(uut.siteDataDir('someApp', null, '3.1')).to.equal(
          '/Library/Application Support/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.siteDataDir(null, null, '3.1')).to.equal(
          '/Library/Application Support');
    });
    it('should handle multipath = true', function () {
      expect(uut.siteDataDir('someApp', null, '3.1', true)).to.deep.equal(
          ['/Library/Application Support/someApp/3.1']);
    });
  });

  describe('siteConfigDir', function () {
    it('should default to /Library/Application Support', function () {
      expect(uut.siteConfigDir()).to.equal(
          '/Library/Application Support');
    });
    it('should include appname', function () {
      expect(uut.siteConfigDir('someApp')).to.equal(
          '/Library/Application Support/someApp');
    });
    it('should include version', function () {
      expect(uut.siteConfigDir('someApp', null, '3.1')).to.equal(
          '/Library/Application Support/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.siteConfigDir(null, null, '3.1')).to.equal(
          '/Library/Application Support');
    });
    it('should handle multipath = true', function () {
      expect(uut.siteConfigDir('someApp', null, '3.1', true)).to.deep.equal(
          ['/Library/Application Support/someApp/3.1']);
    });
  });

  describe('userLogDir', function () {
    it('should default to ~/Library/Logs', function () {
      expect(uut.userLogDir()).to.equal(
          '/Users/fake-home/Library/Logs');
    });
    it('should include appname', function () {
      expect(uut.userLogDir('someApp')).to.equal(
          '/Users/fake-home/Library/Logs/someApp');
    });
    it('should include version', function () {
      expect(uut.userLogDir('someApp', null, '3.1')).to.equal(
          '/Users/fake-home/Library/Logs/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userLogDir(null, null, '3.1')).to.equal(
          '/Users/fake-home/Library/Logs');
    });    
  });
});
