# Changelog

## [1.1.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/1.0.3-beta.1...1.1.0-beta.1) (2025-10-31)


### Features

* [REL-10136] revamp json editing experience ([#233](https://github.com/launchdarkly/launchdarkly-toolbar/issues/233)) ([003e0d7](https://github.com/launchdarkly/launchdarkly-toolbar/commit/003e0d7386ab09e12f966528493703285e7b0713))

## [1.0.3-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/1.0.2-beta.1...1.0.3-beta.1) (2025-10-28)


### Bug Fixes

* [REL-10230] preserve search term when toggling active tab ([#225](https://github.com/launchdarkly/launchdarkly-toolbar/issues/225)) ([46bc323](https://github.com/launchdarkly/launchdarkly-toolbar/commit/46bc323f4f41d777432b1b877add0eff3461b9b4))
* preserve search term when toggling active tab ([46bc323](https://github.com/launchdarkly/launchdarkly-toolbar/commit/46bc323f4f41d777432b1b877add0eff3461b9b4))
* remove unused dependencies and excessive peer dependencies ([#239](https://github.com/launchdarkly/launchdarkly-toolbar/issues/239)) ([82f9235](https://github.com/launchdarkly/launchdarkly-toolbar/commit/82f92356a36203a63066c07b69b6095c90424599))

## [1.0.2-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/1.0.1-beta.1...1.0.2-beta.1) (2025-10-23)


### Bug Fixes

* [REL-10308] consistent toolbar height ([#217](https://github.com/launchdarkly/launchdarkly-toolbar/issues/217)) ([8f4755e](https://github.com/launchdarkly/launchdarkly-toolbar/commit/8f4755eaed661060b5f779f7bd33101db02af921))
* [REL-10339] update react, react-dom to be peer deps ([#218](https://github.com/launchdarkly/launchdarkly-toolbar/issues/218)) ([098cc91](https://github.com/launchdarkly/launchdarkly-toolbar/commit/098cc911eec2c49417e8e5459469c91b240253c9))

## [1.0.1-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/1.0.0-beta.1...1.0.1-beta.1) (2025-10-23)


### Bug Fixes

* use composedPath for auto-collapse click detection ([#215](https://github.com/launchdarkly/launchdarkly-toolbar/issues/215)) ([2e11db0](https://github.com/launchdarkly/launchdarkly-toolbar/commit/2e11db0f0a4ffdd106641a5630c2eb4928e565ed))

## [1.0.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.26.0-beta.1...1.0.0-beta.1) (2025-10-21)


### ⚠ BREAKING CHANGES

* [REL-9841] modify toolbar to be framework-agnostic using shadow DOM ([#157](https://github.com/launchdarkly/launchdarkly-toolbar/issues/157))
* Major restructure to industry-standard monorepo pattern

### Features

* [REL-10137] add IconLinkButton and use that for linking to create missing flag ([#186](https://github.com/launchdarkly/launchdarkly-toolbar/issues/186)) ([398c8eb](https://github.com/launchdarkly/launchdarkly-toolbar/commit/398c8eb432c166bf5f5fe9addaea7eb979e73779))
* [REL-10145] Update 'pin' functionality to be called 'Auto-collapse' ([#193](https://github.com/launchdarkly/launchdarkly-toolbar/issues/193)) ([fd4562b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/fd4562bfe3a8a6543220c7d8c8d8b87bc57b5af8))
* [REL-9492] Add create flag option for unknown feature flag evaluations ([#108](https://github.com/launchdarkly/launchdarkly-toolbar/issues/108)) ([10f0138](https://github.com/launchdarkly/launchdarkly-toolbar/commit/10f0138692d9975da8a36d765c16e8293976eef6))
* [REL-9565] add 'Reload on Flag Change' setting + functionality ([#185](https://github.com/launchdarkly/launchdarkly-toolbar/issues/185)) ([22afc0b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/22afc0bda3be16c663c723b2edfafd25d26897dc))
* [REL-9746] add FocusScope around expanded toolbar ([#138](https://github.com/launchdarkly/launchdarkly-toolbar/issues/138)) ([76fc359](https://github.com/launchdarkly/launchdarkly-toolbar/commit/76fc35956bdcd564d7947723f3ae6f9e4c8eac7a))
* [REL-9841] modify toolbar to be framework-agnostic using shadow DOM ([#157](https://github.com/launchdarkly/launchdarkly-toolbar/issues/157)) ([613c36e](https://github.com/launchdarkly/launchdarkly-toolbar/commit/613c36ea99d4e9e0f4cb5ff5d6f4f6b1e43104d0))
* add configurable eventCapacity to EventInterceptionPlugin ([#103](https://github.com/launchdarkly/launchdarkly-toolbar/issues/103)) ([2acc493](https://github.com/launchdarkly/launchdarkly-toolbar/commit/2acc4932e54d33385f209551c2fe326d13b4392e))
* Add support for all corner toolbar positions ([#128](https://github.com/launchdarkly/launchdarkly-toolbar/issues/128)) ([05c9037](https://github.com/launchdarkly/launchdarkly-toolbar/commit/05c9037a6df94a312ce7ed761b603c2d16868857))
* add toolbar pinning functionality  ([#111](https://github.com/launchdarkly/launchdarkly-toolbar/issues/111)) ([a912491](https://github.com/launchdarkly/launchdarkly-toolbar/commit/a9124915700599e1a76150e12f51836847c21fe5))
* allow dragging toolbar when expanded ([#133](https://github.com/launchdarkly/launchdarkly-toolbar/issues/133)) ([1fd998f](https://github.com/launchdarkly/launchdarkly-toolbar/commit/1fd998fce3a0350876334f45f759226e45eeccb8))
* Enable events tab in dev-server mode ([#153](https://github.com/launchdarkly/launchdarkly-toolbar/issues/153)) ([bfb8d2f](https://github.com/launchdarkly/launchdarkly-toolbar/commit/bfb8d2f164c5fc14a098f639f2f623029cc739e4))
* enhance toolbar focus management for a11y ([#125](https://github.com/launchdarkly/launchdarkly-toolbar/issues/125)) ([80460cf](https://github.com/launchdarkly/launchdarkly-toolbar/commit/80460cf2fc811bf876e486c00919a9d915f74fa5))
* improve toolbar drag behavior with momentum and smooth animations ([2e8f4dd](https://github.com/launchdarkly/launchdarkly-toolbar/commit/2e8f4dd4a23a4f5623aaa399540983105ba737d7))
* reduce list item heights for flag and events tabs ([#100](https://github.com/launchdarkly/launchdarkly-toolbar/issues/100)) ([fde7c08](https://github.com/launchdarkly/launchdarkly-toolbar/commit/fde7c08880b82a5d7206519255587eeb7906b8fe))
* **REL-9867:** improve toolbar drag behavior with momentum and smooth animations ([#152](https://github.com/launchdarkly/launchdarkly-toolbar/issues/152)) ([2e8f4dd](https://github.com/launchdarkly/launchdarkly-toolbar/commit/2e8f4dd4a23a4f5623aaa399540983105ba737d7))
* Remove LaunchPad UI dependency and inline components ([#155](https://github.com/launchdarkly/launchdarkly-toolbar/issues/155)) ([8af81cd](https://github.com/launchdarkly/launchdarkly-toolbar/commit/8af81cda85cf0aeea99125f6193f3bb29352ff4e))
* setup telemetry for toolbar ([#126](https://github.com/launchdarkly/launchdarkly-toolbar/issues/126)) ([74ead85](https://github.com/launchdarkly/launchdarkly-toolbar/commit/74ead85e956fffeb6c1cdcd658cc5697f807b75b))
* toolbar click-to-expand; smoother collapse bounce; drag threshold; tests updated ([#124](https://github.com/launchdarkly/launchdarkly-toolbar/issues/124)) ([3a6cf50](https://github.com/launchdarkly/launchdarkly-toolbar/commit/3a6cf50a060833095fb4c00a469ac7f595bce19e))
* use ld logo instead of text in header ([#122](https://github.com/launchdarkly/launchdarkly-toolbar/issues/122)) ([ee59f8e](https://github.com/launchdarkly/launchdarkly-toolbar/commit/ee59f8eb1741aee65aea9ef6e2f6d5ed36355413))


### Bug Fixes

* [REL-9795] move blur handler up so it can close properly after search clear ([#148](https://github.com/launchdarkly/launchdarkly-toolbar/issues/148)) ([9a1530b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/9a1530b9842384d3ed7cdf74b37d620fe3ae3db0))
* [REL-9865] toolbar keyboard navigation improvements ([#150](https://github.com/launchdarkly/launchdarkly-toolbar/issues/150)) ([774523f](https://github.com/launchdarkly/launchdarkly-toolbar/commit/774523ff4f16fabd76a3dc93f8b640c0c658d002))
* move blur handler up so it can close properly after search clear ([9a1530b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/9a1530b9842384d3ed7cdf74b37d620fe3ae3db0))
* search animation stutter and improve UX polish ([#142](https://github.com/launchdarkly/launchdarkly-toolbar/issues/142)) ([b1618d8](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b1618d8f6bc229384639dee27f74d2c405d1b062))
* Update CircleLogo component styles and event types ([#135](https://github.com/launchdarkly/launchdarkly-toolbar/issues/135)) ([6cb56c7](https://github.com/launchdarkly/launchdarkly-toolbar/commit/6cb56c7bbb91986be67a7a892e5e78ec41a337b3))
* update toolbar icons to match launchpad icons ([#199](https://github.com/launchdarkly/launchdarkly-toolbar/issues/199)) ([66fdb57](https://github.com/launchdarkly/launchdarkly-toolbar/commit/66fdb57b17fce54b65d25f7f1b4eb6f031382aef))
* Update zIndex value for LaunchDarklyToolbar to higher value ([#132](https://github.com/launchdarkly/launchdarkly-toolbar/issues/132)) ([5115b61](https://github.com/launchdarkly/launchdarkly-toolbar/commit/5115b614a058d61076adce96ccd7825b9f1de99f))
* z index configuration for dropdowns ([#137](https://github.com/launchdarkly/launchdarkly-toolbar/issues/137)) ([d62a575](https://github.com/launchdarkly/launchdarkly-toolbar/commit/d62a57541075380fa633c1deb022f0c6f9698b61))


### Code Refactoring

* Restructure to proper monorepo layout ([#102](https://github.com/launchdarkly/launchdarkly-toolbar/issues/102)) ([e8d215a](https://github.com/launchdarkly/launchdarkly-toolbar/commit/e8d215af5dcca3d44c6ba62fe3dfc0d95efca08a))

## [0.26.0](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.25.0...0.26.0) (2025-10-17)


### Features

* [REL-10145] Update 'pin' functionality to be called 'Auto-collapse' ([#193](https://github.com/launchdarkly/launchdarkly-toolbar/issues/193)) ([fd4562b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/fd4562bfe3a8a6543220c7d8c8d8b87bc57b5af8))
* [REL-9565] add 'Reload on Flag Change' setting + functionality ([#185](https://github.com/launchdarkly/launchdarkly-toolbar/issues/185)) ([22afc0b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/22afc0bda3be16c663c723b2edfafd25d26897dc))


### Bug Fixes

* update toolbar icons to match launchpad icons ([#199](https://github.com/launchdarkly/launchdarkly-toolbar/issues/199)) ([66fdb57](https://github.com/launchdarkly/launchdarkly-toolbar/commit/66fdb57b17fce54b65d25f7f1b4eb6f031382aef))

## [0.25.0](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.24.0-beta.1...0.25.0-beta.1) (2025-10-15)


### Features

* [REL-10137] add IconLinkButton and use that for linking to create missing flag ([#186](https://github.com/launchdarkly/launchdarkly-toolbar/issues/186)) ([398c8eb](https://github.com/launchdarkly/launchdarkly-toolbar/commit/398c8eb432c166bf5f5fe9addaea7eb979e73779))

## [0.24.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.23.1-beta.1...0.24.0-beta.1) (2025-10-06)


### Features

* Remove LaunchPad UI dependency and inline components ([#155](https://github.com/launchdarkly/launchdarkly-toolbar/issues/155)) ([8af81cd](https://github.com/launchdarkly/launchdarkly-toolbar/commit/8af81cda85cf0aeea99125f6193f3bb29352ff4e))

## [0.23.1-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.23.0-beta.1...0.23.1-beta.1) (2025-10-04)


### Bug Fixes

* [REL-9865] toolbar keyboard navigation improvements ([#150](https://github.com/launchdarkly/launchdarkly-toolbar/issues/150)) ([774523f](https://github.com/launchdarkly/launchdarkly-toolbar/commit/774523ff4f16fabd76a3dc93f8b640c0c658d002))

## [0.23.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.22.2-beta.1...0.23.0-beta.1) (2025-10-03)


### Features

* [REL-9746] add FocusScope around expanded toolbar ([#138](https://github.com/launchdarkly/launchdarkly-toolbar/issues/138)) ([76fc359](https://github.com/launchdarkly/launchdarkly-toolbar/commit/76fc35956bdcd564d7947723f3ae6f9e4c8eac7a))
* Enable events tab in dev-server mode ([#153](https://github.com/launchdarkly/launchdarkly-toolbar/issues/153)) ([bfb8d2f](https://github.com/launchdarkly/launchdarkly-toolbar/commit/bfb8d2f164c5fc14a098f639f2f623029cc739e4))
* improve toolbar drag behavior with momentum and smooth animations ([2e8f4dd](https://github.com/launchdarkly/launchdarkly-toolbar/commit/2e8f4dd4a23a4f5623aaa399540983105ba737d7))
* **REL-9867:** improve toolbar drag behavior with momentum and smooth animations ([#152](https://github.com/launchdarkly/launchdarkly-toolbar/issues/152)) ([2e8f4dd](https://github.com/launchdarkly/launchdarkly-toolbar/commit/2e8f4dd4a23a4f5623aaa399540983105ba737d7))


### Bug Fixes

* [REL-9795] move blur handler up so it can close properly after search clear ([#148](https://github.com/launchdarkly/launchdarkly-toolbar/issues/148)) ([9a1530b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/9a1530b9842384d3ed7cdf74b37d620fe3ae3db0))
* move blur handler up so it can close properly after search clear ([9a1530b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/9a1530b9842384d3ed7cdf74b37d620fe3ae3db0))

## [0.22.2-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.22.1-beta.1...0.22.2-beta.1) (2025-10-02)


### Bug Fixes

* search animation stutter and improve UX polish ([#142](https://github.com/launchdarkly/launchdarkly-toolbar/issues/142)) ([b1618d8](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b1618d8f6bc229384639dee27f74d2c405d1b062))

## [0.22.1-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.22.0-beta.1...0.22.1-beta.1) (2025-09-30)


### Bug Fixes

* Update CircleLogo component styles and event types ([#135](https://github.com/launchdarkly/launchdarkly-toolbar/issues/135)) ([6cb56c7](https://github.com/launchdarkly/launchdarkly-toolbar/commit/6cb56c7bbb91986be67a7a892e5e78ec41a337b3))
* z index configuration for dropdowns ([#137](https://github.com/launchdarkly/launchdarkly-toolbar/issues/137)) ([d62a575](https://github.com/launchdarkly/launchdarkly-toolbar/commit/d62a57541075380fa633c1deb022f0c6f9698b61))

## [0.22.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.21.0-beta.1...0.22.0-beta.1) (2025-09-30)


### Features

* allow dragging toolbar when expanded ([#133](https://github.com/launchdarkly/launchdarkly-toolbar/issues/133)) ([1fd998f](https://github.com/launchdarkly/launchdarkly-toolbar/commit/1fd998fce3a0350876334f45f759226e45eeccb8))


### Bug Fixes

* Update zIndex value for LaunchDarklyToolbar to higher value ([#132](https://github.com/launchdarkly/launchdarkly-toolbar/issues/132)) ([5115b61](https://github.com/launchdarkly/launchdarkly-toolbar/commit/5115b614a058d61076adce96ccd7825b9f1de99f))

## [0.21.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.20.0-beta.1...0.21.0-beta.1) (2025-09-30)


### Features

* Add support for all corner toolbar positions ([#128](https://github.com/launchdarkly/launchdarkly-toolbar/issues/128)) ([05c9037](https://github.com/launchdarkly/launchdarkly-toolbar/commit/05c9037a6df94a312ce7ed761b603c2d16868857))
* enhance toolbar focus management for a11y ([#125](https://github.com/launchdarkly/launchdarkly-toolbar/issues/125)) ([80460cf](https://github.com/launchdarkly/launchdarkly-toolbar/commit/80460cf2fc811bf876e486c00919a9d915f74fa5))
* setup telemetry for toolbar ([#126](https://github.com/launchdarkly/launchdarkly-toolbar/issues/126)) ([74ead85](https://github.com/launchdarkly/launchdarkly-toolbar/commit/74ead85e956fffeb6c1cdcd658cc5697f807b75b))

## [0.20.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.19.0-beta.1...0.20.0-beta.1) (2025-09-29)


### Features

* toolbar click-to-expand; smoother collapse bounce; drag threshold; tests updated ([#124](https://github.com/launchdarkly/launchdarkly-toolbar/issues/124)) ([3a6cf50](https://github.com/launchdarkly/launchdarkly-toolbar/commit/3a6cf50a060833095fb4c00a469ac7f595bce19e))
* use ld logo instead of text in header ([#122](https://github.com/launchdarkly/launchdarkly-toolbar/issues/122)) ([ee59f8e](https://github.com/launchdarkly/launchdarkly-toolbar/commit/ee59f8eb1741aee65aea9ef6e2f6d5ed36355413))

## [0.19.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.18.0-beta.1...0.19.0-beta.1) (2025-09-25)


### Features

* add toolbar pinning functionality  ([#111](https://github.com/launchdarkly/launchdarkly-toolbar/issues/111)) ([a912491](https://github.com/launchdarkly/launchdarkly-toolbar/commit/a9124915700599e1a76150e12f51836847c21fe5))

## [0.18.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.17.0-beta.1...0.18.0-beta.1) (2025-09-24)


### Features

* [REL-9492] Add create flag option for unknown feature flag evaluations ([#108](https://github.com/launchdarkly/launchdarkly-toolbar/issues/108)) ([10f0138](https://github.com/launchdarkly/launchdarkly-toolbar/commit/10f0138692d9975da8a36d765c16e8293976eef6))

## [0.17.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.16.0-beta.1...0.17.0-beta.1) (2025-09-23)


### Features

* reduce list item heights for flag and events tabs ([#100](https://github.com/launchdarkly/launchdarkly-toolbar/issues/100)) ([fde7c08](https://github.com/launchdarkly/launchdarkly-toolbar/commit/fde7c08880b82a5d7206519255587eeb7906b8fe))

## [0.16.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.15.0-beta.1...0.16.0-beta.1) (2025-09-19)


### Features

* add configurable eventCapacity to EventInterceptionPlugin ([#103](https://github.com/launchdarkly/launchdarkly-toolbar/issues/103)) ([2acc493](https://github.com/launchdarkly/launchdarkly-toolbar/commit/2acc4932e54d33385f209551c2fe326d13b4392e))

## [0.15.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.14.0-beta.1...0.15.0-beta.1) (2025-09-19)


### Features

* Restructure to proper monorepo layout for better maintainability ([#102](https://github.com/launchdarkly/launchdarkly-toolbar/issues/102)) ([e8d215a](https://github.com/launchdarkly/launchdarkly-toolbar/commit/e8d215af5dcca3d44c6ba62fe3dfc0d95efca08a))

## [0.14.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.13.3-beta.1...0.14.0-beta.1) (2025-09-17)


### Features

* add e2e test for sdk mode and improve test selectors with accessibility ([#91](https://github.com/launchdarkly/launchdarkly-toolbar/issues/91)) ([c465bea](https://github.com/launchdarkly/launchdarkly-toolbar/commit/c465bea5a253f6ab253c1def0aee184f36bc9b48))

## [0.13.3-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.13.2-beta.1...0.13.3-beta.1) (2025-09-16)


### Bug Fixes

* bump launchpad to 0.16.9 ([#96](https://github.com/launchdarkly/launchdarkly-toolbar/issues/96)) ([79a840d](https://github.com/launchdarkly/launchdarkly-toolbar/commit/79a840dce46fd7e348e3778b91f49a21350906f7))

## [0.13.2-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.13.1-beta.1...0.13.2-beta.1) (2025-09-16)


### Bug Fixes

* Update default logging setting to false ([#88](https://github.com/launchdarkly/launchdarkly-toolbar/issues/88)) ([9e44601](https://github.com/launchdarkly/launchdarkly-toolbar/commit/9e446012bd902c1d98fcc91a6d1daf9989ba605c))

## [0.13.1-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.13.0-beta.1...0.13.1-beta.1) (2025-09-15)


### Bug Fixes

* reset key state when focus is lost to modals ([#87](https://github.com/launchdarkly/launchdarkly-toolbar/issues/87)) ([3e4a759](https://github.com/launchdarkly/launchdarkly-toolbar/commit/3e4a759db0676069e781cd87bcc79defd5518010))
* **toolbar:** reset key state when focus is lost to modals ([3e4a759](https://github.com/launchdarkly/launchdarkly-toolbar/commit/3e4a759db0676069e781cd87bcc79defd5518010))

## [0.13.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.12.0-beta.1...0.13.0-beta.1) (2025-09-12)


### Features

* add event interception and monitoring capabilities with plugin architecture ([#67](https://github.com/launchdarkly/launchdarkly-toolbar/issues/67)) ([1b7ca9c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/1b7ca9c62ff490429b28c6030cb4efcdfc7d89ee))

## [0.12.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.11.1-beta.1...0.12.0-beta.1) (2025-09-12)


### Features

* add modular exports and optimise bundle size through tree shaking ([#82](https://github.com/launchdarkly/launchdarkly-toolbar/issues/82)) ([462ce54](https://github.com/launchdarkly/launchdarkly-toolbar/commit/462ce5477eeb26a9736d708ddfc20ba8c65f051b))

## [0.11.1-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.11.0-beta.1...0.11.1-beta.1) (2025-09-10)


### Bug Fixes

* conditional calling of hooks due to early return in FlagSdkOverrideTabContent ([#78](https://github.com/launchdarkly/launchdarkly-toolbar/issues/78)) ([ebb412a](https://github.com/launchdarkly/launchdarkly-toolbar/commit/ebb412a2c2ed90f93452c9a6a3b3ccd3e44924a0))

## [0.11.0-beta.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/0.10.1...0.11.0-beta.1) (2025-09-10)

### Features

- Add CI and publish workflows for npm package release ([#2](https://github.com/launchdarkly/launchdarkly-toolbar/issues/2)) ([e3772af](https://github.com/launchdarkly/launchdarkly-toolbar/commit/e3772af12dc06b1d44c5193ac5b20d63d578eeb3))
- add drag-and-drop functionality to toolbar ([#56](https://github.com/launchdarkly/launchdarkly-toolbar/issues/56)) ([39ddbd5](https://github.com/launchdarkly/launchdarkly-toolbar/commit/39ddbd5c81ca47d6bece6dcaae60f82ffe6f388f))
- Add release-as 0.2.0 to release-please config ([#20](https://github.com/launchdarkly/launchdarkly-toolbar/issues/20)) ([7d13392](https://github.com/launchdarkly/launchdarkly-toolbar/commit/7d13392df5441a7ee993a9592f702c0075f8c363))
- Add useToolbarVisibility hook for toolbar visibility control ([#27](https://github.com/launchdarkly/launchdarkly-toolbar/issues/27)) ([52a7d8a](https://github.com/launchdarkly/launchdarkly-toolbar/commit/52a7d8a18a56666cdf883cee4706eaea95e1e245))
- bump launchpad ([#69](https://github.com/launchdarkly/launchdarkly-toolbar/issues/69)) ([f1573e4](https://github.com/launchdarkly/launchdarkly-toolbar/commit/f1573e492c67719c453eb57a9a18dac4a0a2a961))
- bump launchpad + react aria versions ([#44](https://github.com/launchdarkly/launchdarkly-toolbar/issues/44)) ([c4b9d37](https://github.com/launchdarkly/launchdarkly-toolbar/commit/c4b9d370f38965ab5613a914e35ffb2285721ec2))
- bump launchpad again ([f1573e4](https://github.com/launchdarkly/launchdarkly-toolbar/commit/f1573e492c67719c453eb57a9a18dac4a0a2a961))
- initialize project by migrating repo from launchdarkly-labs org ([#1](https://github.com/launchdarkly/launchdarkly-toolbar/issues/1)) ([a185d85](https://github.com/launchdarkly/launchdarkly-toolbar/commit/a185d85e43ea21b2b4de4f2e5645a8e66ae48310))
- introduce SDK integration using flag override plugin ([#54](https://github.com/launchdarkly/launchdarkly-toolbar/issues/54)) ([11f1aca](https://github.com/launchdarkly/launchdarkly-toolbar/commit/11f1aca6bffaee4fbc01d811bfb109add6693f29))
- migrate from css modules to vanilla extract ([#3](https://github.com/launchdarkly/launchdarkly-toolbar/issues/3)) ([b778105](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b77810519949ce9f5d943799c9fdf1c2e446e822))
- Update initial position state to 'left' in App component ([#12](https://github.com/launchdarkly/launchdarkly-toolbar/issues/12)) ([b058e7d](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b058e7dc1a0ef85e4ced04f790eb98e436f66f34))
- update publish commands to use "pnpm release" instead ([#14](https://github.com/launchdarkly/launchdarkly-toolbar/issues/14)) ([478d108](https://github.com/launchdarkly/launchdarkly-toolbar/commit/478d108261788a12c2e392d4a0072a7b318f63ae))
- Update release version to 0.4.0 in config file ([39c537c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/39c537c8bdd8ead5bb0b75c5243306965cd46257))
- Update release version to 0.4.0 in config file ([#24](https://github.com/launchdarkly/launchdarkly-toolbar/issues/24)) ([39c537c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/39c537c8bdd8ead5bb0b75c5243306965cd46257))
- Update version numbers to 0.6.0 and adjust CLI project name ([#40](https://github.com/launchdarkly/launchdarkly-toolbar/issues/40)) ([78abfde](https://github.com/launchdarkly/launchdarkly-toolbar/commit/78abfde25360796c126d96007f128688f2aa67c6))

### Bug Fixes

- bump release action version ([#74](https://github.com/launchdarkly/launchdarkly-toolbar/issues/74)) ([b59d92c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b59d92c0e7730bc80fecb3af9490f182223fe513))
- improve accessibility with proper ARIA labels for toolbar component ([#42](https://github.com/launchdarkly/launchdarkly-toolbar/issues/42)) ([753bd7f](https://github.com/launchdarkly/launchdarkly-toolbar/commit/753bd7fe617259bb2c547c6db5d89e54871717d0))
- inject styles for toolbar using rslib and custom script to override problematic line in dist ([#18](https://github.com/launchdarkly/launchdarkly-toolbar/issues/18)) ([0354bf8](https://github.com/launchdarkly/launchdarkly-toolbar/commit/0354bf85c3e08daef6982459c002b712a2e50acc))
- Remove unnecessary SearchIcon import in SearchSection.tsx ([#8](https://github.com/launchdarkly/launchdarkly-toolbar/issues/8)) ([923f2b4](https://github.com/launchdarkly/launchdarkly-toolbar/commit/923f2b4e23eb1abf018b3c7d1ba421fe1ffea02a))
- show selected variant for JSON dropdowns ([#63](https://github.com/launchdarkly/launchdarkly-toolbar/issues/63)) ([3ac3b53](https://github.com/launchdarkly/launchdarkly-toolbar/commit/3ac3b53b4878994b2ca233d98dbff91a91113fbb))
- update polling to help toolbar recover from connection failures ([#34](https://github.com/launchdarkly/launchdarkly-toolbar/issues/34)) ([4a81b27](https://github.com/launchdarkly/launchdarkly-toolbar/commit/4a81b27bee826532e3df03d4c409df22bdda600d))
- update version to 1.0.1 and add http-server dependency ([#7](https://github.com/launchdarkly/launchdarkly-toolbar/issues/7)) ([7683e5b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/7683e5bdbc31fcbfd80ae616a3ccf82d529c72af))

## [0.10.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/toolbar-v0.10.0...toolbar-v0.10.1) (2025-09-09)

### Bug Fixes

- bump release action version ([#74](https://github.com/launchdarkly/launchdarkly-toolbar/issues/74)) ([b59d92c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b59d92c0e7730bc80fecb3af9490f182223fe513))

## [0.10.0](https://github.com/launchdarkly/launchdarkly-toolbar/compare/toolbar-v0.9.1...toolbar-v0.10.0) (2025-09-08)

### Features

- bump launchpad ([#69](https://github.com/launchdarkly/launchdarkly-toolbar/issues/69)) ([f1573e4](https://github.com/launchdarkly/launchdarkly-toolbar/commit/f1573e492c67719c453eb57a9a18dac4a0a2a961))
- bump launchpad again ([f1573e4](https://github.com/launchdarkly/launchdarkly-toolbar/commit/f1573e492c67719c453eb57a9a18dac4a0a2a961))

## [0.9.1](https://github.com/launchdarkly/launchdarkly-toolbar/compare/toolbar-v0.9.0...toolbar-v0.9.1) (2025-08-28)

### Bug Fixes

- show selected variant for JSON dropdowns ([#63](https://github.com/launchdarkly/launchdarkly-toolbar/issues/63)) ([3ac3b53](https://github.com/launchdarkly/launchdarkly-toolbar/commit/3ac3b53b4878994b2ca233d98dbff91a91113fbb))

## [0.9.0](https://github.com/launchdarkly/launchdarkly-toolbar/compare/toolbar-v0.8.0...toolbar-v0.9.0) (2025-08-26)

### Features

- add drag-and-drop functionality to toolbar ([#56](https://github.com/launchdarkly/launchdarkly-toolbar/issues/56)) ([39ddbd5](https://github.com/launchdarkly/launchdarkly-toolbar/commit/39ddbd5c81ca47d6bece6dcaae60f82ffe6f388f))

## [0.8.0](https://github.com/launchdarkly/launchdarkly-toolbar/compare/toolbar-v0.7.0...toolbar-v0.8.0) (2025-08-13)

### Features

- bump launchpad + react aria versions ([#44](https://github.com/launchdarkly/launchdarkly-toolbar/issues/44)) ([c4b9d37](https://github.com/launchdarkly/launchdarkly-toolbar/commit/c4b9d370f38965ab5613a914e35ffb2285721ec2))

## [0.7.0](https://github.com/launchdarkly/launchdarkly-toolbar/compare/toolbar-v0.6.0...toolbar-v0.7.0) (2025-08-10)

### Features

- Add CI and publish workflows for npm package release ([#2](https://github.com/launchdarkly/launchdarkly-toolbar/issues/2)) ([e3772af](https://github.com/launchdarkly/launchdarkly-toolbar/commit/e3772af12dc06b1d44c5193ac5b20d63d578eeb3))
- Add release-as 0.2.0 to release-please config ([#20](https://github.com/launchdarkly/launchdarkly-toolbar/issues/20)) ([7d13392](https://github.com/launchdarkly/launchdarkly-toolbar/commit/7d13392df5441a7ee993a9592f702c0075f8c363))
- Add useToolbarVisibility hook for toolbar visibility control ([#27](https://github.com/launchdarkly/launchdarkly-toolbar/issues/27)) ([52a7d8a](https://github.com/launchdarkly/launchdarkly-toolbar/commit/52a7d8a18a56666cdf883cee4706eaea95e1e245))
- initialize project by migrating repo from launchdarkly-labs org ([#1](https://github.com/launchdarkly/launchdarkly-toolbar/issues/1)) ([a185d85](https://github.com/launchdarkly/launchdarkly-toolbar/commit/a185d85e43ea21b2b4de4f2e5645a8e66ae48310))
- migrate from css modules to vanilla extract ([#3](https://github.com/launchdarkly/launchdarkly-toolbar/issues/3)) ([b778105](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b77810519949ce9f5d943799c9fdf1c2e446e822))
- Update initial position state to 'left' in App component ([#12](https://github.com/launchdarkly/launchdarkly-toolbar/issues/12)) ([b058e7d](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b058e7dc1a0ef85e4ced04f790eb98e436f66f34))
- update publish commands to use "pnpm release" instead ([#14](https://github.com/launchdarkly/launchdarkly-toolbar/issues/14)) ([478d108](https://github.com/launchdarkly/launchdarkly-toolbar/commit/478d108261788a12c2e392d4a0072a7b318f63ae))
- Update release version to 0.4.0 in config file ([39c537c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/39c537c8bdd8ead5bb0b75c5243306965cd46257))
- Update release version to 0.4.0 in config file ([#24](https://github.com/launchdarkly/launchdarkly-toolbar/issues/24)) ([39c537c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/39c537c8bdd8ead5bb0b75c5243306965cd46257))
- Update version numbers to 0.6.0 and adjust CLI project name ([#40](https://github.com/launchdarkly/launchdarkly-toolbar/issues/40)) ([78abfde](https://github.com/launchdarkly/launchdarkly-toolbar/commit/78abfde25360796c126d96007f128688f2aa67c6))

### Bug Fixes

- improve accessibility with proper ARIA labels for toolbar component ([#42](https://github.com/launchdarkly/launchdarkly-toolbar/issues/42)) ([753bd7f](https://github.com/launchdarkly/launchdarkly-toolbar/commit/753bd7fe617259bb2c547c6db5d89e54871717d0))
- inject styles for toolbar using rslib and custom script to override problematic line in dist ([#18](https://github.com/launchdarkly/launchdarkly-toolbar/issues/18)) ([0354bf8](https://github.com/launchdarkly/launchdarkly-toolbar/commit/0354bf85c3e08daef6982459c002b712a2e50acc))
- Remove unnecessary SearchIcon import in SearchSection.tsx ([#8](https://github.com/launchdarkly/launchdarkly-toolbar/issues/8)) ([923f2b4](https://github.com/launchdarkly/launchdarkly-toolbar/commit/923f2b4e23eb1abf018b3c7d1ba421fe1ffea02a))
- update polling to help toolbar recover from connection failures ([#34](https://github.com/launchdarkly/launchdarkly-toolbar/issues/34)) ([4a81b27](https://github.com/launchdarkly/launchdarkly-toolbar/commit/4a81b27bee826532e3df03d4c409df22bdda600d))
- update version to 1.0.1 and add http-server dependency ([#7](https://github.com/launchdarkly/launchdarkly-toolbar/issues/7)) ([7683e5b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/7683e5bdbc31fcbfd80ae616a3ccf82d529c72af))

## [0.2.0](https://github.com/launchdarkly/launchdarkly-toolbar/compare/toolbar-v0.1.0...toolbar-v0.2.0) (2025-08-09)

### Features

- Add CI and publish workflows for npm package release ([#2](https://github.com/launchdarkly/launchdarkly-toolbar/issues/2)) ([e3772af](https://github.com/launchdarkly/launchdarkly-toolbar/commit/e3772af12dc06b1d44c5193ac5b20d63d578eeb3))
- Add release-as 0.2.0 to release-please config ([#20](https://github.com/launchdarkly/launchdarkly-toolbar/issues/20)) ([7d13392](https://github.com/launchdarkly/launchdarkly-toolbar/commit/7d13392df5441a7ee993a9592f702c0075f8c363))
- Add useToolbarVisibility hook for toolbar visibility control ([#27](https://github.com/launchdarkly/launchdarkly-toolbar/issues/27)) ([52a7d8a](https://github.com/launchdarkly/launchdarkly-toolbar/commit/52a7d8a18a56666cdf883cee4706eaea95e1e245))
- initialize project by migrating repo from launchdarkly-labs org ([#1](https://github.com/launchdarkly/launchdarkly-toolbar/issues/1)) ([a185d85](https://github.com/launchdarkly/launchdarkly-toolbar/commit/a185d85e43ea21b2b4de4f2e5645a8e66ae48310))
- migrate from css modules to vanilla extract ([#3](https://github.com/launchdarkly/launchdarkly-toolbar/issues/3)) ([b778105](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b77810519949ce9f5d943799c9fdf1c2e446e822))
- Update initial position state to 'left' in App component ([#12](https://github.com/launchdarkly/launchdarkly-toolbar/issues/12)) ([b058e7d](https://github.com/launchdarkly/launchdarkly-toolbar/commit/b058e7dc1a0ef85e4ced04f790eb98e436f66f34))
- update publish commands to use "pnpm release" instead ([#14](https://github.com/launchdarkly/launchdarkly-toolbar/issues/14)) ([478d108](https://github.com/launchdarkly/launchdarkly-toolbar/commit/478d108261788a12c2e392d4a0072a7b318f63ae))
- Update release version to 0.4.0 in config file ([39c537c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/39c537c8bdd8ead5bb0b75c5243306965cd46257))
- Update release version to 0.4.0 in config file ([#24](https://github.com/launchdarkly/launchdarkly-toolbar/issues/24)) ([39c537c](https://github.com/launchdarkly/launchdarkly-toolbar/commit/39c537c8bdd8ead5bb0b75c5243306965cd46257))

### Bug Fixes

- inject styles for toolbar using rslib and custom script to override problematic line in dist ([#18](https://github.com/launchdarkly/launchdarkly-toolbar/issues/18)) ([0354bf8](https://github.com/launchdarkly/launchdarkly-toolbar/commit/0354bf85c3e08daef6982459c002b712a2e50acc))
- Remove unnecessary SearchIcon import in SearchSection.tsx ([#8](https://github.com/launchdarkly/launchdarkly-toolbar/issues/8)) ([923f2b4](https://github.com/launchdarkly/launchdarkly-toolbar/commit/923f2b4e23eb1abf018b3c7d1ba421fe1ffea02a))
- update polling to help toolbar recover from connection failures ([#34](https://github.com/launchdarkly/launchdarkly-toolbar/issues/34)) ([4a81b27](https://github.com/launchdarkly/launchdarkly-toolbar/commit/4a81b27bee826532e3df03d4c409df22bdda600d))
- update version to 1.0.1 and add http-server dependency ([#7](https://github.com/launchdarkly/launchdarkly-toolbar/issues/7)) ([7683e5b](https://github.com/launchdarkly/launchdarkly-toolbar/commit/7683e5bdbc31fcbfd80ae616a3ccf82d529c72af))

## [0.1.0](https://github.com/launchdarkly/launchdarkly-toolbar/compare/toolbar-v0.0.1...toolbar-v0.1.0) (2025-08-09)

### Features

- Initial release
