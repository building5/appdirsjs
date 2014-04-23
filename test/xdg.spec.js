// Copyright (c) 2014. David M. Lee, II.
/* global before, after, describe, it */
/* jshint expr:true */
'use strict';

var appdirs = require('..'),
    chai = require('chai'),
    expect = chai.expect;

chai.config.includeStack = true;

describe('AppDirs on *NIX', function () {
  var envOrig,
      uut = appdirs.xdg;

  before(function () {
    envOrig = {
      XDG_DATA_HOME: process.env.XDG_DATA_HOME,
      XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME,
      XDG_DATA_DIRS: process.env.XDG_DATA_DIRS,
      HOME: process.env.HOME
    };
    process.env.HOME = '/home/fake-home';
    delete process.env.XDG_DATA_HOME;
    delete process.env.XDG_CONFIG_HOME;
    delete process.env.XDG_DATA_DIRS;
  });

  after(function () {
    process.env.HOME = envOrig.HOME;
    if (envOrig.XDG_DATA_HOME !== undefined) {
      process.env.XDG_DATA_HOME = envOrig.XDG_DATA_HOME;
    }
    if (envOrig.XDG_CONFIG_HOME !== undefined) {
      process.env.XDG_CONFIG_HOME = envOrig.XDG_CONFIG_HOME;
    }
    if (envOrig.XDG_DATA_DIRS !== undefined) {
      process.env.XDG_DATA_DIRS = envOrig.XDG_DATA_DIRS;
    }
  });

  describe('userDataDir', function () {
    it('should default to ~/.local/share', function () {
      expect(uut.userDataDir()).to.equal(
          '/home/fake-home/.local/share');
    });
    it('should include appname', function () {
      expect(uut.userDataDir('someApp')).to.equal(
          '/home/fake-home/.local/share/someApp');
    });
    it('should include version', function () {
      expect(uut.userDataDir('someApp', null, '3.1')).to.equal(
          '/home/fake-home/.local/share/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userDataDir(null, null, '3.1')).to.equal(
          '/home/fake-home/.local/share');
    });
  });

  describe('userConfigDir', function () {
    it('should default to ~/.config', function () {
      expect(uut.userConfigDir()).to.equal(
          '/home/fake-home/.config');
    });
    it('should include appname', function () {
      expect(uut.userConfigDir('someApp')).to.equal(
          '/home/fake-home/.config/someApp');
    });
    it('should include version', function () {
      expect(uut.userConfigDir('someApp', null, '3.1')).to.equal(
          '/home/fake-home/.config/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userConfigDir(null, null, '3.1')).to.equal(
          '/home/fake-home/.config');
    });
  });

  describe('userCacheDir', function () {
    it('should default to ~/.cache', function () {
      expect(uut.userCacheDir()).to.equal(
          '/home/fake-home/.cache');
    });
    it('should include appname', function () {
      expect(uut.userCacheDir('someApp')).to.equal(
          '/home/fake-home/.cache/someApp');
    });
    it('should include version', function () {
      expect(uut.userCacheDir('someApp', null, '3.1')).to.equal(
          '/home/fake-home/.cache/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userCacheDir(null, null, '3.1')).to.equal(
          '/home/fake-home/.cache');
    });
  });

  describe('siteDataDir', function () {
    it('should default to /usr/local/share', function () {
      expect(uut.siteDataDir()).to.equal(
          '/usr/local/share');
    });
    it('should include appname', function () {
      expect(uut.siteDataDir('someApp')).to.equal(
          '/usr/local/share/someApp');
    });
    it('should include version', function () {
      expect(uut.siteDataDir('someApp', null, '3.1')).to.equal(
          '/usr/local/share/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.siteDataDir(null, null, '3.1')).to.equal(
          '/usr/local/share');
    });
    it('should handle multipath = true', function () {
      expect(uut.siteDataDir('someApp', null, '3.1', true)).to.deep.equal(
          ['/usr/local/share/someApp/3.1', '/usr/share/someApp/3.1']);
    });
  });

  describe('siteConfigDir', function () {
    it('should default to /etc/xdg', function () {
      expect(uut.siteConfigDir()).to.equal(
          '/etc/xdg');
    });
    it('should include appname', function () {
      expect(uut.siteConfigDir('someApp')).to.equal(
          '/etc/xdg/someApp');
    });
    it('should include version', function () {
      expect(uut.siteConfigDir('someApp', null, '3.1')).to.equal(
          '/etc/xdg/someApp/3.1');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.siteConfigDir(null, null, '3.1')).to.equal(
          '/etc/xdg');
    });
    it('should handle multipath = true', function () {
      expect(uut.siteConfigDir('someApp', null, '3.1', true)).to.deep.equal(
          ['/etc/xdg/someApp/3.1']);
    });
  });

  describe('userLogDir', function () {
    it('should default to ~/.cache/log', function () {
      expect(uut.userLogDir()).to.equal(
          '/home/fake-home/.cache/log');
    });
    it('should include appname', function () {
      expect(uut.userLogDir('someApp')).to.equal(
          '/home/fake-home/.cache/someApp/log');
    });
    it('should include version', function () {
      expect(uut.userLogDir('someApp', null, '3.1')).to.equal(
          '/home/fake-home/.cache/someApp/3.1/log');
    });
    it('should ignore version if appname is null', function () {
      expect(uut.userLogDir(null, null, '3.1')).to.equal(
          '/home/fake-home/.cache/log');
    });
  });

  describe('when XDG_DATA_HOME is set', function () {
    before(function () {
      process.env.XDG_DATA_HOME = '/xdg/data/home';
    });
    after(function () {
      delete process.env.XDG_DATA_HOME;
    });

    describe('userDataDir', function () {
      it('should use XDG_DATA_HOME', function () {
        expect(uut.userDataDir('someApp', null, '3.1')).to.equal(
            '/xdg/data/home/someApp/3.1');
      });
    });
  });

  describe('when XDG_CONFIG_HOME is set', function () {
    before(function () {
      process.env.XDG_CONFIG_HOME = '/xdg/config/home';
    });
    after(function () {
      delete process.env.XDG_CONFIG_HOME;
    });

    describe('userConfigDir', function () {
      it('should use XDG_CONFIG_HOME', function () {
        expect(uut.userConfigDir('someApp', null, '3.1')).to.equal(
            '/xdg/config/home/someApp/3.1');
      });
    });
  });

  describe('when XDG_CACHE_HOME is set', function () {
    before(function () {
      process.env.XDG_CACHE_HOME = '/xdg/cache/home';
    });
    after(function () {
      delete process.env.XDG_CACHE_HOME;
    });

    describe('userCacheDir', function () {
      it('should use XDG_CACHE_HOME', function () {
        expect(uut.userCacheDir('someApp', null, '3.1')).to.equal(
            '/xdg/cache/home/someApp/3.1');
      });
    });
  });

  describe('when XDG_DATA_DIRS is set', function () {
    describe('to single directory', function () {
      before(function () {
        process.env.XDG_DATA_DIRS = '/xdg/data/dir';
      });
      after(function () {
        delete process.env.XDG_DATA_DIRS;
      });

      describe('siteDataDir', function () {
        it('should return single path by default', function () {
          expect(uut.siteDataDir('someApp', null, '3.1')).to.equal(
              '/xdg/data/dir/someApp/3.1');
        });

        it('should handle multipath = true', function () {
          expect(uut.siteDataDir('someApp', null, '3.1', true)).to.deep.equal(
              ['/xdg/data/dir/someApp/3.1']);
        });
      });
    });

    describe('to multiple directories', function () {
      before(function () {
        process.env.XDG_DATA_DIRS = '/xdg/data/dir1:/xdg/data/dir2';
      });
      after(function () {
        delete process.env.XDG_DATA_DIRS;
      });

      describe('siteDataDir', function () {
        it('should return single path by default', function () {
          expect(uut.siteDataDir('someApp', null, '3.1')).to.equal(
              '/xdg/data/dir1/someApp/3.1');
        });

        it('should handle multipath = true', function () {
          expect(uut.siteDataDir('someApp', null, '3.1', true)).to.deep.equal(
              ['/xdg/data/dir1/someApp/3.1', '/xdg/data/dir2/someApp/3.1']);
        });
      });
    });
  });

  describe('when XDG_CONFIG_DIRS is set', function () {
    describe('to single directory', function () {
      before(function () {
        process.env.XDG_CONFIG_DIRS = '/xdg/config/dir';
      });
      after(function () {
        delete process.env.XDG_CONFIG_DIRS;
      });

      describe('siteConfigDir', function () {
        it('should return single path by default', function () {
          expect(uut.siteConfigDir('someApp', null, '3.1')).to.equal(
              '/xdg/config/dir/someApp/3.1');
        });

        it('should handle multipath = true', function () {
          expect(uut.siteConfigDir('someApp', null, '3.1', true)).to.deep.equal(
              ['/xdg/config/dir/someApp/3.1']);
        });
      });
    });

    describe('to multiple directories', function () {
      before(function () {
        process.env.XDG_CONFIG_DIRS = '/xdg/config/dir1:/xdg/config/dir2';
      });
      after(function () {
        delete process.env.XDG_CONFIG_DIRS;
      });
      describe('siteConfigDir', function () {
        it('should return single path by default', function () {
          expect(uut.siteConfigDir('someApp', null, '3.1')).to.equal(
              '/xdg/config/dir1/someApp/3.1');
        });

        it('should handle multipath = true', function () {
          expect(uut.siteConfigDir('someApp', null, '3.1', true)).to.deep.equal(
              ['/xdg/config/dir1/someApp/3.1', '/xdg/config/dir2/someApp/3.1']);

        });
      });
    });
  });
});
