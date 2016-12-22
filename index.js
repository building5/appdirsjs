// Copyright (c) 2014. David M. Lee, II.
/*jshint unused:vars */
'use strict';

/**
 * Platform specific directory locator.
 *
 * The API's all follow the same general pattern:
 * <ul>
 *   <li>All arguments are optional. When called with no arguments, the function
 *       returns the base path, instead of one specific for an application.</li>
 *   <li>The version is only appended if the <code>appname</code> is provided.
 *   </li>
 *   <li>Windows requires the application author, in addition to the application
 *       name, for locating application specific directories. If not give, this
 *       defaults to <code>appname</code>.</li>
 *   <li>Both the OS X and XDG implementations are portable, and will run on any
 *       platform.</li>
 *   <li>Windows support is unimplemented, because reasons. When it is
 *       implemented, it will probably only run on Windows</li>
 * </ul>
 * @module appdirs
 */

var os = require('os'),
    path = require('path');

/**
 * Append the name and and version to a path.
 *
 * Both the appname and version are optional. The version is only appended if
 * the appname.
 *
 * @param {string} dir Base directory.
 * @param {string} [appname] Optional name to append.
 * @param {string} [version] Optional version to append.
 * @returns {string} Resulting path
 * @private
 */
var appendNameVersion = function (dir, appname, version) {
  if (appname) {
    dir = path.join(dir, appname);
    if (version) {
      dir = path.join(dir, version);
    }
  }
  return dir;
};

/*jshint maxlen:false */
/**
 * Windows appdirs implementation.
 *
 * The standard directory structure for Windows can be found on
 * [MSDN]{@link http://support.microsoft.com/default.aspx?scid=kb;en-us;310294#XSLTH3194121123120121120120}.
 */
/*jshint maxlen:80 */
exports.windows = {
  userDataDir: function (appname, appauthor, version, roaming) {
    var dir = roaming ? process.env.APPDATA : process.env.LOCALAPPDATA;
    return appendNameVersion(dir, appname, version);
  },
  userConfigDir: function (appname, appauthor, version, roaming) {
    var dir = roaming ? process.env.APPDATA : process.env.LOCALAPPDATA;
    return appendNameVersion(dir, appname, version);
  },
  userCacheDir: function (appname, appauthor, version) {
    return appendNameVersion(process.env.LOCALAPPDATA, appname, version);
  },
  siteDataDir: function (appname, appauthor, version, multipath) {
    var dir = appendNameVersion(process.env.ALLUSERSPROFILE, appname, version);
    if (multipath) {
      return [dir];
    }
    return dir;
  },
  siteConfigDir: function (appname, appauthor, version, multipath) {
    var dir = appendNameVersion(process.env.ALLUSERSPROFILE, appname, version);
    if (multipath) {
      return [dir];
    }
    return dir;
  },
  userLogDir: function (appname, appauthor, version) {
    return appendNameVersion(process.env.ALLUSERSPROFILE, appname, version);
  }
};

/*jshint maxlen:false */
/**
 * OS X appdirs implementation.
 *
 * The standard directory structure for OS X can be found on
 * [the apple developer site]{@link https://developer.apple.com/library/mac/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html}.
 */
/*jshint maxlen:80 */
exports.darwin = {
  userDataDir: function (appname, appauthor, version, roaming) {
    var dir = path.join(process.env.HOME, 'Library/Application Support');
    return appendNameVersion(dir, appname, version);
  },
  userConfigDir: function (appname, appauthor, version, roaming) {
    return exports.darwin.userDataDir(appname, appauthor, version, roaming);
  },
  userCacheDir: function (appname, appauthor, version) {
    var dir = path.join(process.env.HOME, 'Library/Caches');
    return appendNameVersion(dir, appname, version);
  },
  siteDataDir: function (appname, appauthor, version, multipath) {
    var dir = appendNameVersion('/Library/Application Support', appname, version);
    if (multipath) {
      return [dir];
    }
    return dir;
  },
  siteConfigDir: function (appname, appauthor, version, multipath) {
    return exports.darwin.siteDataDir(appname, appauthor, version, multipath);
  },
  userLogDir: function (appname, appauthor, version) {
    var dir = path.join(process.env.HOME, 'Library/Logs');
    return appendNameVersion(dir, appname, version);
  }
};

/*jshint maxlen:false */
/**
 * XDG appdirs implementation.
 *
 * The is the standard directory structure appdirs uses for *NIX operating
 * systems. The XDG spec can be found on
 * [the FreeDesktop standards site]{@link http://standards.freedesktop.org/basedir-spec/basedir-spec-latest.html}.
 */
/*jshint maxlen:80 */
exports.xdg = {
  userDataDir: function (appname, appauthor, version, roaming) {
    var dir = process.env.XDG_DATA_HOME ||
        path.join(process.env.HOME, '.local/share');
    return appendNameVersion(dir, appname, version);
  },
  userConfigDir: function (appname, appauthor, version, roaming) {
    var dir = process.env.XDG_CONFIG_HOME ||
        path.join(process.env.HOME, '.config');
    return appendNameVersion(dir, appname, version);
  },
  userCacheDir: function (appname, appauthor, version) {
    var dir = process.env.XDG_CACHE_HOME ||
        path.join(process.env.HOME, '.cache');
    return appendNameVersion(dir, appname, version);
  },
  siteDataDir: function (appname, appauthor, version, multipath) {
    var dirstr = process.env.XDG_DATA_DIRS ||
            ['/usr/local/share', '/usr/share'].join(path.delimiter),
        dirs = dirstr.split(path.delimiter).map(function (dir) {
          return appendNameVersion(dir, appname, version);
        });
    if (multipath) {
      return dirs;
    } else {
      return dirs[0];
    }
  },
  siteConfigDir: function (appname, appauthor, version, multipath) {
    var dirstr = process.env.XDG_CONFIG_DIRS || '/etc/xdg',
        dirs = dirstr.split(path.delimiter).map(function (dir) {
          return appendNameVersion(dir, appname, version);
        });
    if (multipath) {
      return dirs;
    } else {
      return dirs[0];
    }
  },
  userLogDir: function (appname, appauthor, version) {
    var cacheDir = exports.xdg.userCacheDir(appname, appauthor, version);
    return path.join(cacheDir, 'log');
  }
};

var impl = (function () {
  switch (os.platform()) {
    case 'win32':
      return exports.windows;
    case 'darwin':
      return exports.darwin;
    default:
      return exports.xdg;
  }
})();

/**
 * Build an AppDirs convenience object.
 *
 * @param {string} appname Application name.
 * @param {string} [appauthor] Application author. Defaults to appname.
 * @param {string} [version] Application version.
 * @param {boolean} [roaming] If true, use directory for roaming profile.
 * @param {boolean} [multipath] If true, return arrays for multipath functions
 *                              (siteDataDir, siteConfigDir).
 * @constructor
 */
var AppDirs = exports.AppDirs =
    function AppDirs(appname, appauthor, version, roaming, multipath) {
      this.appname = appname;
      this.appauthor = appauthor;
      this.version = version;
      this.roaming = roaming;
      this.multipath = multipath;
    };

/**
 * User data directory.
 * @returns {string}
 */
AppDirs.prototype.userDataDir = function () {
  return impl.userDataDir(this.appname, this.appauthor, this.version,
      this.roaming);
};

/**
 * User configuration directory.
 * @returns {string}
 */
AppDirs.prototype.userConfigDir = function () {
  return impl.userConfigDir(this.appname, this.appauthor, this.version,
      this.roaming);
};

/**
 * User cache directory.
 * @returns {string}
 */
AppDirs.prototype.userCacheDir = function () {
  return impl.userCacheDir(this.appname, this.appauthor, this.version);
};

/**
 * Site data directory.
 * @returns {string}
 */
AppDirs.prototype.siteDataDir = function () {
  return impl.siteDataDir(this.appname, this.appauthor, this.version,
      this.multipath);
};

/**
 * Site configuration directory.
 * @returns {string}
 */
AppDirs.prototype.siteConfigDir = function () {
  return impl.siteConfigDir(this.appname, this.appauthor, this.version,
      this.multipath);
};

/**
 * User log directory.
 * @returns {string}
 */
AppDirs.prototype.userLogDir = function () {
  return impl.userLogDir(this.appname, this.appauthor, this.version);
};

/**
 * Return full path to the user-specific data dir for this application.
 *
 * Typical user cache directories are:
 * <dl>
 *    <dt>Mac OS X</dt>
 *      <dd>~/Library/Application Support/{AppName}</dd>
 *    <dt>Unix</dt>
 *      <dd>~/.local/share/{AppName}/log</dd>
 *    <dt>Win 7 (not roaming)</dt>
 *      <dd>C:\Users\{username}\AppData\Local\{AppAuthor}\{AppName}</dd>
 *    <dt>Win 7 (roaming)</dt>
 *      <dd>C:\Users\{username}\AppData\Roaming\{AppAuthor}\{AppName}</dd>
 * </dl>
 *
 * @param {string} [appname] Application name. If not give, then the base user
 *    data directory is returned.
 * @param {string} [appauthor] Application author's name. This falls back to
 *    appname.
 * @param {string} [version] Optional version to append to the path. Only
 *    applied when appname is present.
 * @param {boolean} [roaming] When set, use the Windows roaming
 *    appdata directory
 * @returns {string} User data directory.
 * @function
 */
exports.userDataDir = impl.userDataDir;
/**
 * Return full path to the user-specific config dir for this application.
 *
 * Typical user data directories are:
 * <dl>
 *   <dt>Mac OS X</dt>
 *     <dd>same as user_data_dir</dd>
 *   <dt>Unix</dt>
 *     <dd>~/.config/{AppName}</dd>
 *   <dt>Windows</dt>
 *     <dd>same as user_data_dir</dd>
 * </dl>
 *
 * @param {string} [appname] Application name. If not give, then the base user
 *    config directory is returned.
 * @param {string} [appauthor] Application author's name. This falls back to
 *    appname.
 * @param {string} [version] Optional version to append to the path. Only
 *    applied when appname is present.
 * @param {boolean} [roaming] When set, use the Windows roaming
 *    appdata directory
 * @returns {string} User config directory.
 * @function
 */
exports.userConfigDir = impl.userConfigDir;
/**
 * Return full path to the user-specific cache dir for this application.
 *
 * Typical user cache directories are:
 * <dl>
 *   <dt>Mac OS X</dt>
 *     <dd>~/Library/Caches/{AppName}</dd>
 *   <dt>Unix</dt>
 *     <dd>~/.cache/{AppName}</dd>
 * </dl>
 *
 * @param {string} [appname] Application name. If not give, then the base user
 *    cache directory is returned.
 * @param {string} [appauthor] Application author's name. This falls back to
 *    appname.
 * @param {string} [version] Optional version to append to the path. Only
 *    applied when appname is present.
 * @returns {string} User cache directory
 * @function
 */
exports.userCacheDir = impl.userCacheDir;
/**
 * Return full path to the user-shared data dir for this application.
 *
 * Typical site data directories are:
 * <dl>
 *   <dt>Mac OS X</dt>
 *     <dd>/Library/Application Support/{AppName}</dd>
 *   <dt>Unix</dt>
 *     <dd>/usr/local/share/{AppName} or /usr/share/{AppName}</dd>
 * </dl>
 *
 * @param {string} [appname] Application name. If not give, then the base site
 *    data directory is returned.
 * @param {string} [appauthor] Application author's name. This falls back to
 *    appname.
 * @param {string} [version] Optional version to append to the path. Only
 *    applied when appname is present.
 * @param {boolean} [multipath] If true, on *NIX, all site data dirs are
 *                              returned.
 * @returns {string} Site data directory.
 * @function
 */
exports.siteDataDir = impl.siteDataDir;
/**
 * Return full path to the user-shared config dir for this application.
 *
 * Typical user data directories are:
 * <dl>
 *   <dt>Mac OS X</dt>
 *     <dd>same as site_data_dir</dd>
 *   <dt>Unix</dt>
 *     <dd>/etc/xdg/{AppName}</dd>
 *   <dt>Windows</dt>
 *     <dd>same as site_data_dir</dd>
 * </dl>
 *
 * @param {string} [appname] Application name. If not give, then the base site
 *    data directory is returned.
 * @param {string} [appauthor] Application author's name. This falls back to
 *    appname.
 * @param {string} [version] Optional version to append to the path. Only
 *    applied when appname is present.
 * @param {boolean} [multipath] If true, on *NIX, all site data dirs are
 *                              returned.
 * @returns {string} Site config directory.
 * @function
 */
exports.siteConfigDir = impl.siteConfigDir;
/**
 * Return full path to the user-specific log dir for this application.
 *
 * Typical user cache directories are:
 * <dl>
 *   <dt>Mac OS X</dt>
 *     <dd>~/Library/Logs/{AppName}</dd>
 *   <dt>Unix</dt>
 *     <dd>~/.cache/{AppName}/log</dd>
 * <dl>
 *
 * @param {string} [appname] Application name. If not give, then the base site
 *    data directory is returned.
 * @param {string} [appauthor] Application author's name. This falls back to
 *    appname.
 * @param {string} [version] Optional version to append to the path. Only
 *    applied when appname is present.
 * @returns {string} User log directory.
 * @function
 */
exports.userLogDir = impl.userLogDir;
