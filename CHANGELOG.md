## [0.4.4](https://github.com/ionited/mask/compare/0.4.3...0.4.4) (2022-07-06)

### Bug Fixes

* **MaskNumber:** delete closest number ([e3aeddf](https://github.com/ionited/mask/commit/e3aeddfdba3ab054d382621e624ce12ed6596b2a))
* use slice instead of substring ([a1d0ff2](https://github.com/ionited/mask/commit/a1d0ff25706c82aeae0dc8cd368b8b9b75683fda))

## [0.4.3](https://github.com/ionited/mask/compare/0.4.2...0.4.3) (2022-07-06)

### Bug Fixes

* allowEmpty default value ([9ef0875](https://github.com/ionited/mask/commit/9ef0875f4ce178a1c31b55d07488d98999cbafc7))
* string output required ([9b40271](https://github.com/ionited/mask/commit/9b40271ee0ff5f428235ab1cec1a146bcfb799b8))
* substr to substring ([72b45fd](https://github.com/ionited/mask/commit/72b45fd491b830e431967c310e69589b23933f0e))

### Features

* **MaskNumber:** add allowNegative option ([9d28d65](https://github.com/ionited/mask/commit/9d28d657a2151af4a3a4ac446a1024a2056f1c9d))

## [0.4.2](https://github.com/ionited/mask/compare/0.4.1...0.4.2) (2021-11-18)

### Bug Fixes

* avoid set null values ([3d7f3fd](https://github.com/ionited/mask/commit/3d7f3fd2ac7723d14909ec1fff2609f75289e13d))


## [0.4.1](https://github.com/ionited/mask/compare/0.4.0...0.4.1) (2021-11-18)

### Bug Fixes

* **MaskDefault:** cursor position ([586d633](https://github.com/ionited/mask/commit/586d6331447b8fa946a7ebb58f1ea245b540a677))
* **MaskDefault:** improve format logic ([5d5739a](https://github.com/ionited/mask/commit/5d5739a96bd83aa9a37c26be1e1ac52cb3ed79fb))
* **MaskCore:** ignore past event ([7422eab](https://github.com/ionited/mask/commit/7422eaba1d67776cc163b5c5a0e61cf38373ff6c))
* **MaskCore:** always dispatch event ([ae3ff7c](https://github.com/ionited/mask/commit/ae3ff7cde145235078631917177279b9c2034edd))
* **MaskCore:** always update ([75a3ffb](https://github.com/ionited/mask/commit/75a3ffbcf6c87e5cd803118fbf9584af48e57e29))


# 0.4.0 (2021-10-06)

### Bug Fixes

* only update cursor on focus ([de251f1](https://github.com/ionited/mask/commit/de251f19897b8e6c0852d356f4e0b7bdc48741e0))
* update input value on events ([1027af1](https://github.com/ionited/mask/commit/1027af18a6b67e78a43cb53746b505faae2f81d4))
* refactor(MaskCore)!: don't call format on init ([6cfa0a8](https://github.com/ionited/mask/commit/6cfa0a8591b6402002ef0037590730474321ae85))

### Features

* **MaskDefault, MaskNumber:** add allowEmpty option ([92b222c](https://github.com/ionited/mask/commit/92b222ccb28b5dccc5f27be8a5dfd7cae63afbd6))

### BREAKING CHANGES

* you need to call format manually on init


# 0.3.0 (2021-10-01)

### Bug Fixes

* Correct main and types files ([0fb1c4a](https://github.com/ionited/mask/commit/0fb1c4aa30b33ad8d59539a9282e7356d5e19c00))
* Correct mask input delete ([f1d0802](https://github.com/ionited/mask/commit/f1d0802e33628068d441994254e5a37039c0730c))
* Dispatch events ([7f03b85](https://github.com/ionited/mask/commit/7f03b852dced9990a2972a6c645523fd90ab1742))
* Dispatch input event after format ([6b24ecf](https://github.com/ionited/mask/commit/6b24ecf4643776da49a516cbacc7863d567c1fb6))
* Expose public functions ([891846c](https://github.com/ionited/mask/commit/891846cc7b65bc31eff5ca4f4a38fd0422f3945c))
* Fix MaskNumber cursor position ([56b8d9c](https://github.com/ionited/mask/commit/56b8d9c05008fe99f83397e3ac5adad64369606c))
* Format correctly integer and decimal parts ([b4f333c](https://github.com/ionited/mask/commit/b4f333c93a5f20d8e28527e6635d43f0aa58b37b))
* Format MaskNumber initial value ([7742ce8](https://github.com/ionited/mask/commit/7742ce8e65c7c839759927f7d39ebc19a897299b))
* Improve cursor position for Android browser ([084927e](https://github.com/ionited/mask/commit/084927eb1c9b02cea047f4da2ec7f251d5b2add2))
* MaskNumber correct default value ([9b4593f](https://github.com/ionited/mask/commit/9b4593f171636117628c436717a3b4de2b21a8ed))
* MaskNumber update el value ([a798f92](https://github.com/ionited/mask/commit/a798f92d23251a7ea19d62c140185855c76cb407))
* pass focus parameter correctly ([b402c1f](https://github.com/ionited/mask/commit/b402c1f5c96f615092d89c437109695abef00faf))
* Revert format behavior ([0d1a593](https://github.com/ionited/mask/commit/0d1a593902561854605985de0c3a462a07fde250))
* Update input value ([5476967](https://github.com/ionited/mask/commit/54769671075cb4ecdbb1c97129d9cecc01a9f7b5))

### Features

* Add MaskNumber end option ([75cee0a](https://github.com/ionited/mask/commit/75cee0a888a3eb99d94e0c389142116f866fb524))
* focus, blur, mouseover and mouseout events ([354dfac](https://github.com/ionited/mask/commit/354dfac70b956008ce2e3365e70045e36a7b7294))
* Npm files ([75abc53](https://github.com/ionited/mask/commit/75abc530a30e892d6334ff0184d05f82b04e97fe))
* Package modules ([b069e36](https://github.com/ionited/mask/commit/b069e3655e5b07853b1f97873ff8af4578f76979))
* Use FileManagerPlugin ([68bdb13](https://github.com/ionited/mask/commit/68bdb13dafa512344950b9bbdf3fa45baffb7ea1))
