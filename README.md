# Mask

> Create your masks easily

Mask comes with two basic implementations MaskDefault and MaskNumber, but you can use MaskCore to do your own masks implementation easily.

## Quick start

Choose your favorite option below:

### Install with NPM

```
npm i @ionited/mask
```

### Get from UNPKG

[https://unpkg.com/@ionited/mask@latest/dist/mask.js](https://unpkg.com/@ionited/mask@latest/dist/mask.js)

---

## Usage

To basic usage you can simply call:

```js
Mask(document.querySelector('#input1'), { mask: '(99) 9999-9999' }); // To use MaskDefault
Mask(document.querySelector('#input2'), { number: true }); // To use MaskNumber
```

### MaskDefault

A simple mask that receives numbers, letters or other symbols

```ts
Mask(el: string, { mask: string });
```

| Symbol   | Pattern          | Description
|:--------:|------------------|-------------
| 9        | `/^[0-9]$/`      | Only numbers
| A        | `/^[A-Za-zÀ-ÿ]$/`| Only letters

Any other symbol is fixed.

### MaskNumber

A mask for monetary and decimal values

```ts
Mask(el: string, { number: true | MaskNumberOptions });

interface MaskNumberOptions {
  decimal: number;
  decimalPoint: string;
  prefix: string;
  thousandPoint: string;
}
```

### MaskCore

You can create your own mask logic easily, you only need `register` a mask and use:

```ts
Mask.register(name: string, mask: any): void;
```

The recommended way to do a new mask is writing a class that extends `MaskOptions`

```ts
interface MaskOptions {
  instance: MaskCore;
  init?(data: MaskData): void;
  beforeInput?(data: MaskData): void;
  input?(data: MaskData): void;
  format(data: MaskData): void;
}

interface MaskData {
  cursorPosition: number;
  delete: boolean;
  focus: boolean;
  input: string;
  inputRaw: string;
  output: string;
}
```

MyMask example (only accept numbers):

```ts
import { MaskData, MaskCore, MaskOptions } from '@ionited/mask/core';

export class MyMask implements MaskOptions {
  instance: MaskCore;

  constructor(el: HTMLInputElement) {
    this.instance = new MaskCore(el, this);
  }

  format(data: MaskData) {
    data.output = data.input.replace(/[^0-9]/g, ''); 
  }
}
```

Register and use:

```ts
Mask.register('myMask', MyMask); // Register

Mask({ myMask: true }); // Enjoy your own mask!
```

## License

Copyright (c) 2021 Ion. Licensed under [Mit License](LICENSE).
