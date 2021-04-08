# Mask

> Create your masks easily

Mask comes with two basic implementations MaskDefault and MaskNumber, but you can use MaskCore to do your own masks implementation easily.

## Quick start

Choose your favorite option below:

### Install with NPM

```
npm i @ionited/mask
```

### Download

[mask.js](dist/mask.js)

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

MaskDefault example:

```ts
import { MaskData, MaskCore, MaskOptions } from '../core';

export class MyMask implements MaskOptions {
  firstInput = 0;
  mask: string;
  maskGroups: any[];

  constructor(el: HTMLInputElement, mask: string) {
    this.mask = mask;
    this.maskGroups = this.getMaskGroups();

    new MaskCore(el, this);
  }

  format(data: MaskData) {
    let 
      val = '',
      firstInvalidIndex = 0,
      lastValidIndex = 0
    ;

    this.maskGroups.forEach((m, index) => {
      if (m instanceof RegExp) {
        const valid = m.test(data.input[index]);

        val = val + (valid ? data.input[index] : '_');

        if (valid) {
          lastValidIndex = index + 1;
        } else if (!firstInvalidIndex) {
          firstInvalidIndex = index;
        }

        if (!this.firstInput) {
          this.firstInput = index; 
        }
      } else {
        val = val + m;
      }
    });

    data.output = val;
    data.cursorPosition = data.delete ? Math.max(this.firstInput, lastValidIndex) : Math.max(firstInvalidIndex, lastValidIndex);
  }
  
  private getMaskGroups() {
    let maskGroups = [] as any[];

    for (let i = 0; i < this.mask.length; i = i + 1) {
      if (this.mask[i] === '9') {
        maskGroups.push(/^[0-9]$/);
      } else if (this.mask[i] === 'A') {
        maskGroups.push(/^[A-Za-zÀ-ÿ]$/);
      } else {
        maskGroups.push(this.mask[i]);
      }
    }

    return maskGroups;
  }
}
```

Register and use:

```ts
Mask.register('myMask', MyMask); // Register

Mask({ myMask: '99 / 99' }); // Enjoy you own mask!
```

## License

Copyright (c) 2021 Ion. Licensed under [Mit License](LICENSE).
