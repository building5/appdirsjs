// Copyright (c) 2014. David M. Lee, II.
/* global before, after, describe, it */
/* jshint expr:true */
'use strict';

var appdirs = require('..'),
    path = require('path'),
    chai = require('chai'),
    expect = chai.expect;

chai.config.includeStack = true;

describe('AppDirs on Windows', function () {
  var localAppData,
      appData,
      allUsersProfile,
      pathJoin,
      uut = appdirs.windows;

  before(function () {
    localAppData = process.env.LOCALAPPDATA;
    appData = process.env.APPDATA;
    allUsersProfile = process.env.ALLUSERSPROFILE;
    pathJoin = path.join;

    process.env.LOCALAPPDATA = 'C:\\Users\\fakeuser\\AppData\\Local';
    process.env.APPDATA = 'C:\\Users\\fakeuser\\AppData\\Roaming';
    process.env.ALLUSERSPROFILE = 'C:\\ProgramData';
    path.join = path.win32.join;
  });

  after(function () {
    process.env.LOCALAPPDATA = localAppData;
    process.env.APPDATA = appData;
    process.env.ALLUSERSPROFILE = allUsersProfile;
    path.join = pathJoin;
  });


  describe('userDataDir', function () {
    it('should default to C:\\Users\\{username}\\AppData\\Local', function () {
      expect(uut.userDataDir()).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local');
    });
    it('should switch to roaming', function () {
      expect(uut.userDataDir(null, null, null, true)).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Roaming');
    });
    it('should include appname', function () {
      expect(uut.userDataDir('someApp')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local\\someApp');
    });
    it('should include version', function () {
      expect(uut.userDataDir('someApp', null, '3.1')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local\\someApp\\3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userDataDir(null, null, '3.1')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local');
    });
  });

  describe('userConfigDir', function () {
    it('should default to C:\\Users\\{username}\\AppData\\Local', function () {
      expect(uut.userConfigDir()).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local');
    });
    it('should switch to roaming', function () {
      expect(uut.userDataDir(null, null, null, true)).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Roaming');
    });
    it('should include appname', function () {
      expect(uut.userConfigDir('someApp')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local\\someApp');
    });
    it('should include version', function () {
      expect(uut.userConfigDir('someApp', null, '3.1')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local\\someApp\\3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userConfigDir(null, null, '3.1')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local');
    });
  });

  describe('userCacheDir', function () {
    it('should default to C:\\Users\\{username}\\AppData\\Local', function () {
      expect(uut.userCacheDir()).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local');
    });
    it('should include appname', function () {
      expect(uut.userCacheDir('someApp')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local\\someApp');
    });
    it('should include version', function () {
      expect(uut.userCacheDir('someApp', null, '3.1')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local\\someApp\\3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userCacheDir(null, null, '3.1')).to.equal(
          'C:\\Users\\fakeuser\\AppData\\Local');
    });
  });

  describe('siteDataDir', function () {
    it('should default to C:\\ProgramData', function () {
      expect(uut.siteDataDir()).to.equal(
          'C:\\ProgramData');
    });
    it('should include appname', function () {
      expect(uut.siteDataDir('someApp')).to.equal(
          'C:\\ProgramData\\someApp');
    });
    it('should include version', function () {
      expect(uut.siteDataDir('someApp', null, '3.1')).to.equal(
          'C:\\ProgramData\\someApp\\3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.siteDataDir(null, null, '3.1')).to.equal(
          'C:\\ProgramData');
    });
    it('should handle multipath = true', function () {
      expect(uut.siteDataDir('someApp', null, '3.1', true)).to.deep.equal(
          ['C:\\ProgramData\\someApp\\3.1']);
    });
  });

  describe('siteConfigDir', function () {
    it('should default to C:\\ProgramData', function () {
      expect(uut.siteDataDir()).to.equal(
          'C:\\ProgramData');
    });
    it('should include appname', function () {
      expect(uut.siteDataDir('someApp')).to.equal(
          'C:\\ProgramData\\someApp');
    });
    it('should include version', function () {
      expect(uut.siteDataDir('someApp', null, '3.1')).to.equal(
          'C:\\ProgramData\\someApp\\3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.siteDataDir(null, null, '3.1')).to.equal(
          'C:\\ProgramData');
    });
    it('should handle multipath = true', function () {
      expect(uut.siteDataDir('someApp', null, '3.1', true)).to.deep.equal(
          ['C:\\ProgramData\\someApp\\3.1']);
    });
  });

  describe('userLogDir', function () {
    it('should default to C:\\ProgramData', function () {
      expect(uut.siteDataDir()).to.equal(
          'C:\\ProgramData');
    });
    it('should include appname', function () {
      expect(uut.siteDataDir('someApp')).to.equal(
          'C:\\ProgramData\\someApp');
    });
    it('should include version', function () {
      expect(uut.siteDataDir('someApp', null, '3.1')).to.equal(
          'C:\\ProgramData\\someApp\\3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.siteDataDir(null, null, '3.1')).to.equal(
          'C:\\ProgramData');
    });
  });

});