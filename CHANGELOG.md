# Changelog

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
