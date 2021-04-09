import { MaskData, MaskCore, MaskOptions } from '../core';

export class MaskDefault implements MaskOptions {
  instance: MaskCore;
  firstInput = 0;
  mask: string;
  maskGroups: any[];

  constructor(el: HTMLInputElement, mask: string) {
    this.mask = mask;
    this.maskGroups = this.getMaskGroups();

    this.instance = new MaskCore(el, this);
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
