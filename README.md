# AppDirs.js

> The wonderful thing about standards is that there are so many of them to
> choose from.

  -- _Andrew Tanenbaum_

When it comes to storing application data, the convention on where to store
your data varies from platform to platform.

This package is a port of the Python [appdirs][] library, which provides a small
set of methods which can be used to locate the preferred directories for user
and site data for an application.

It currently supports OS X and Unix operating systems (Unix support is
according to the [XDG specification][]). Windows support is not yet
implemented, but a pull request adding that would be greatly appreciated!

## Installation

AppDirs.js is [hosted on NPM][], so you can simply install it, and add
it to your `package.json` as a dependency.

    $ npm install --save appdirs

## Directories

The directories the AppDirs.js can help you locate are:

 * user data dir (`user_data_dir`)
 * user config dir (`user_config_dir`)
 * user cache dir (`user_cache_dir`)
 * site data dir (`site_data_dir`)
 * site config dir (`site_config_dir`)
 * user log dir (`user_log_dir`)

## Usage

See the [JSDocs] for specifics on using the API.

 [appdirs]: https://github.com/ActiveState/appdirs
 [xdg specification]: http://standards.freedesktop.org/basedir-spec/basedir-spec-latest.html
 [jsdocs]: http://building5.github.io/appdirsjs/
 [hosted on NPM]: https://www.npmjs.org/package/appdirs
