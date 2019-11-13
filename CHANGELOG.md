# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0-rc.0](https://github.com/cormacrelf/angular-skyhook/compare/v1.3.3...v1.4.0-rc.0) (2019-11-13)


### Bug Fixes

* **core, multi-backend:** Deprecate backendFactory in forRoot., and createDefaultMultiBackend. ([15c0b0e](https://github.com/cormacrelf/angular-skyhook/commit/15c0b0e))
* **multi-backend:** upgrade to dnd-multi-backend v5.0.0-rc01 ([f2abc1f](https://github.com/cormacrelf/angular-skyhook/commit/f2abc1f))





## [1.3.3](https://github.com/cormacrelf/angular-skyhook/compare/v1.3.2...v1.3.3) (2019-10-23)


### Bug Fixes

* **core:** provide global context correctly and fix options injection, fix [#505](https://github.com/cormacrelf/angular-skyhook/issues/505), fix [#506](https://github.com/cormacrelf/angular-skyhook/issues/506) ([9c7d4a7](https://github.com/cormacrelf/angular-skyhook/commit/9c7d4a7))
* **core:** schedule a reconnect() call to match react-dnd's behaviour ([f97738f](https://github.com/cormacrelf/angular-skyhook/commit/f97738f))





## [1.3.2](https://github.com/cormacrelf/angular-skyhook/compare/v1.3.1...v1.3.2) (2019-10-09)


### Bug Fixes

* **#431:** make createDefaultMultiBackend a function ([d60c858](https://github.com/cormacrelf/angular-skyhook/commit/d60c858)), closes [#431](https://github.com/cormacrelf/angular-skyhook/issues/431)





## [1.3.1](https://github.com/cormacrelf/angular-skyhook/compare/v1.3.0...v1.3.1) (2019-10-06)


### Bug Fixes

* **sortable:** fix regression of { ...spec } splatting of NgRxSortable ([8dc2f2e](https://github.com/cormacrelf/angular-skyhook/commit/8dc2f2e))





# [1.3.0](https://github.com/cormacrelf/angular-skyhook/compare/v1.2.1...v1.3.0) (2019-10-06)


### Bug Fixes

* bump minimum dnd-core to v9 ([7626565](https://github.com/cormacrelf/angular-skyhook/commit/7626565))


### Features

* **sortable:** Add a monitor argument to most SortableSpec callbacks. ([9bbb97c](https://github.com/cormacrelf/angular-skyhook/commit/9bbb97c))
* **sortable:** support `accepts` and `createData` in NgRxSortableConfiguration ([1f857f5](https://github.com/cormacrelf/angular-skyhook/commit/1f857f5))





Note that since the `react-dnd` monorepo pushes breaking changes frequently, 
which are usually unrelated to `dnd-core`, bumping minimum versions of those 
packages is not considered a breaking change to this library. Skyhook versions 
assume you will just track the latest version of the backends, etc. Watch your 
yarn/npm output for incompatible peer dependencies of those and upgrade as 
required.

## [1.2.1](https://github.com/cormacrelf/angular-skyhook/compare/v1.2.0...v1.2.1) (2019-06-16)


### Bug Fixes

* **core:** more flexible zone.js peer dependency for angular 8+ ([caf5e2e](https://github.com/cormacrelf/angular-skyhook/commit/caf5e2e))
* **core, multi-backend:** bump dnd-core & friends to 8.0.0 ([09b26c9](https://github.com/cormacrelf/angular-skyhook/commit/09b26c9))
* **multi-backend:** use `react-dnd-touch-backend`'s own Typescript definitions ([5de8ec0](https://github.com/cormacrelf/angular-skyhook/commit/5de8ec0))
* **sortable:** implement SortableSpec.canDrag, fixes [#360](https://github.com/cormacrelf/angular-skyhook/issues/360) ([98e4561](https://github.com/cormacrelf/angular-skyhook/commit/98e4561))





# [1.2.0](https://github.com/cormacrelf/angular-skyhook/compare/v1.1.3...v1.2.0) (2019-03-23)


### Features

* **sortable:** allow setting a sortable's DropTargets' types separately from the sources. ([e430827](https://github.com/cormacrelf/angular-skyhook/commit/e430827))





## [1.1.3](https://github.com/cormacrelf/angular-skyhook/compare/v1.1.2...v1.1.3) (2019-02-28)


### Bug Fixes

* **sortable:** fix mismatched versions ([9787248](https://github.com/cormacrelf/angular-skyhook/commit/9787248))





## [1.1.2](https://github.com/cormacrelf/angular-skyhook/compare/v1.1.1...v1.1.2) (2019-02-28)


### Bug Fixes

* **sortable:** spillTarget not working in AOT mode ([3a0f566](https://github.com/cormacrelf/angular-skyhook/commit/3a0f566))





## [1.1.1](https://github.com/cormacrelf/angular-skyhook/compare/v1.1.0...v1.1.1) (2019-02-14)

Generally, upgrades through a few major versions of dnd-core and backends.


### Bug Fixes

* **multi-backend:** upgrade touch backend to be 7.0.0-compatible ([b4eac65](https://github.com/cormacrelf/angular-skyhook/commit/b4eac65))





# [1.1.0](https://github.com/cormacrelf/angular-skyhook/compare/v1.1.0-beta.1...v1.1.0) (2018-11-27)

### Features

* `@angular-skyhook/sortable` is released.

### Bug Fixes

* upgrade compodoc (also fixes [#205](https://github.com/cormacrelf/angular-skyhook/issues/205)) ([a30fd95](https://github.com/cormacrelf/angular-skyhook/commit/a30fd95))
* upgrade dnd-core and html5-backend dependencies ([f5a19b8](https://github.com/cormacrelf/angular-skyhook/commit/f5a19b8))





<a name="1.1.0-beta.1"></a>
# [1.1.0-beta.1](https://github.com/cormacrelf/angular-skyhook/compare/v1.1.0-beta.0...v1.1.0-beta.1) (2018-09-13)


### Bug Fixes

* **sortable:** fire hover when moving from spill BACK to same position ([86308da](https://github.com/cormacrelf/angular-skyhook/commit/86308da))
* **sortable:** make isEmpty work for every kind of Iterable<Data> using for ... of ([19ceddf](https://github.com/cormacrelf/angular-skyhook/commit/19ceddf))
* **sortable:** set external original index to -1, so spillTarget.drop can recognise them ([5d60def](https://github.com/cormacrelf/angular-skyhook/commit/5d60def))


### Features

* **sortable:** [ssSortableTrigger]="fixed" to trigger reorder sooner for fixed-height elements ([78144c7](https://github.com/cormacrelf/angular-skyhook/commit/78144c7))





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
