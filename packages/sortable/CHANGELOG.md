# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.3](https://github.com/cormacrelf/angular-skyhook/compare/v1.3.2...v1.3.3) (2019-10-23)

**Note:** Version bump only for package @angular-skyhook/sortable





## [1.3.1](https://github.com/cormacrelf/angular-skyhook/compare/v1.3.0...v1.3.1) (2019-10-06)


### Bug Fixes

* **sortable:** fix regression of { ...spec } splatting of NgRxSortable ([8dc2f2e](https://github.com/cormacrelf/angular-skyhook/commit/8dc2f2e))





# [1.3.0](https://github.com/cormacrelf/angular-skyhook/compare/v1.2.1...v1.3.0) (2019-10-06)


### Features

* **sortable:** Add a monitor argument to most SortableSpec callbacks. ([9bbb97c](https://github.com/cormacrelf/angular-skyhook/commit/9bbb97c))
* **sortable:** support `accepts` and `createData` in NgRxSortableConfiguration ([1f857f5](https://github.com/cormacrelf/angular-skyhook/commit/1f857f5))





## [1.2.1](https://github.com/cormacrelf/angular-skyhook/compare/v1.2.0...v1.2.1) (2019-06-16)


### Bug Fixes

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

**Note:** Version bump only for package @angular-skyhook/sortable





# [1.1.0](https://github.com/cormacrelf/angular-skyhook/compare/v1.1.0-beta.1...v1.1.0) (2018-11-27)

**Note:** Version bump only for package @angular-skyhook/sortable





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

* **package:** switch to scoped packages, i.e. [@skyhook](https://github.com/skyhook)/core ([874723a](https://github.com/cormacrelf/angular-skyhook/commit/874723a))
* Publish under `[@angular-skyhook](https://github.com/angular-skyhook)/*` scope ([d14b101](https://github.com/cormacrelf/angular-skyhook/commit/d14b101))
