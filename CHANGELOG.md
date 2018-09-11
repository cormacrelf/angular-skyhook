# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.1.0-beta.0"></a>
# [1.1.0-beta.0](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.11...v1.1.0-beta.0) (2018-09-11)


### Features

* **sortable:** make sortable package public ([f82eb22](https://github.com/cormacrelf/angular-skyhook/commit/f82eb22))





<a name="1.0.11"></a>
## [1.0.11](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.10...v1.0.11) (2018-09-11)


### Bug Fixes

* publish dist directory instead of whole folder ([50f7dc9](https://github.com/cormacrelf/angular-skyhook/commit/50f7dc9))





<a name="1.0.10"></a>
## [1.0.10](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.9...v1.0.10) (2018-09-11)


### Bug Fixes

* **package:** shouldn't ever have supported Angular 5, without rxjs 6. Bump both peerdeps to 6, + tslib. ([734d66e](https://github.com/cormacrelf/angular-skyhook/commit/734d66e))
* **package:** switch to scoped packages, i.e. [@skyhook](https://github.com/skyhook)/core ([874723a](https://github.com/cormacrelf/angular-skyhook/commit/874723a))
* **package:** update react-dnd-touch-backend to version 0.5.1 ([244e71c](https://github.com/cormacrelf/angular-skyhook/commit/244e71c)), closes [#11](https://github.com/cormacrelf/angular-skyhook/issues/11)
* Publish under `[@angular-skyhook](https://github.com/angular-skyhook)/*` scope ([d14b101](https://github.com/cormacrelf/angular-skyhook/commit/d14b101))
* simplify yarn add suggestion ([a6e0023](https://github.com/cormacrelf/angular-skyhook/commit/a6e0023))





<a name="1.0.9"></a>
## [1.0.9](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.8...v1.0.9) (2018-07-04)


### Bug Fixes

* catch potential edge case for hanging connect() subscription ([4e225ee](https://github.com/cormacrelf/angular-skyhook/commit/4e225ee))
* **multi-backend:** typings for touch backend now include all the options; use dnd-core types ([606d94f](https://github.com/cormacrelf/angular-skyhook/commit/606d94f))



<a name="1.0.8"></a>
## [1.0.8](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.7...v1.0.8) (2018-06-23)


### Bug Fixes

* **multi-backend:** touch backend type declaration had implicit any. fix [#5](https://github.com/cormacrelf/angular-skyhook/issues/5) ([b057ad2](https://github.com/cormacrelf/angular-skyhook/commit/b057ad2))


<a name="1.0.7"></a>
## [1.0.7](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.6...v1.0.7) (2018-06-21)

### Bug Fixes

* TS < 2.7 compatibility by dropping implied `unique symbol`. fix
[#4](https://github.com/cormacrelf/angular-skyhook/issues/4)
([4984dc3](https://github.com/cormacrelf/angular-skyhook/commit/4984dc3))


<a name="1.0.6"></a>
## [1.0.6](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.5...v1.0.6) (2018-06-19)

### New Features

* add `getHandlerId()` to connection objects, for use with the test backend
  ([4952b85](https://github.com/cormacrelf/angular-skyhook/commit/4952b85))

### Bug Fixes

* dnd module using wrong dnd-core types in BackendFactory confusion, now allows
  basic test/html5 backends again
  ([48538f8](https://github.com/cormacrelf/angular-skyhook/commit/48538f8))

<a name="1.0.5"></a>
## [1.0.5](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.4...v1.0.5) (2018-06-19)

### New Features

* support specifying the TypeScript type of an item or drop result
  ([5b885e6](https://github.com/cormacrelf/angular-skyhook/commit/5b885e6))

<a name="1.0.4"></a>
## [1.0.4](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.3...v1.0.4) (2018-06-18)

### New Features

* use dnd-core type annotations
  ([55e4a6c](https://github.com/cormacrelf/angular-skyhook/commit/55e4a6c))
* allow `[noHTML5Preview]` to disable HTML5 drag preview easily
  ([55e4a6c](https://github.com/cormacrelf/angular-skyhook/commit/55e4a6c))

### Bug fixes

* **multi-backend:** use react-dnd-html5-backend's own types 
  ([bbe1439](https://github.com/cormacrelf/angular-skyhook/commit/bbe1439))

<a name="1.0.3"></a>
## [1.0.3](https://github.com/cormacrelf/angular-skyhook/compare/v1.0.0...v1.0.3) (2018-06-17)

v1.0.3 is really the initial release. Everything before that was learning how to
publish Angular modules.
