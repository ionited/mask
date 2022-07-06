import { MaskData, MaskCore, MaskOptions } from '../core';

interface MaskDefaultOptions {
  allowEmpty?: boolean;
  mask: string;
}

export class MaskDefault implements MaskOptions {
  instance: MaskCore;
  firstInput?: number = undefined;
  maskGroups: any[];
  options: MaskDefaultOptions = {
    allowEmpty: false,
    mask: ''
  }

  private default = '';

  constructor(el: HTMLInputElement, options: string | MaskDefaultOptions) {
    if (typeof options === 'object')
      this.options = {
        allowEmpty: options.allowEmpty,
        mask: options.mask
      }
    else
      this.options = {
        allowEmpty: false,
        mask: options
      }

    this.maskGroups = this.getMaskGroups();
    this.instance = new MaskCore(el, this);
  }

  init(data: MaskData) {
    if (data.input || !this.options.allowEmpty) this.format(data);
    else data.output = '';
  }

  format(data: MaskData) {
    let
      val = '',
      firstInvalidIndex: number = -1,
      lastValidIndex = 0,
      index = 0;

    this.maskGroups.forEach((m, maskIndex) => {
      if (m instanceof RegExp) {
        let valid = false;

        do {
          valid = m.test(data.input[index]);

          if (valid) lastValidIndex = maskIndex + 1;
          else if (firstInvalidIndex === -1) firstInvalidIndex = maskIndex;

          if (this.firstInput === undefined) this.firstInput = maskIndex;

          index++;
        } while(!valid && data.input[index]);

        val = val + (valid ? data.input[index - 1] : '_');
      } else {
        val = val + m;

        if (data.input[index] === m) index++;
      }
    });

    data.output = val;
    data.cursorPosition = data.delete ? Math.max(this.firstInput as number, data.cursorPosition) : Math.max(firstInvalidIndex, lastValidIndex);
  }

  blur(data: MaskData) {
    if (this.options.allowEmpty && data.input === this.default) data.output = '';
  }

  mouseover(data: MaskData) {
    if (this.options.allowEmpty) this.format(data);
  }

  mouseout(data: MaskData) {
    if (this.options.allowEmpty && data.input === this.default && document.activeElement != this.instance.el) data.output = '';
  }
  
  private getMaskGroups() {
    let maskGroups = [] as any[];

    for (let i = 0; i < this.options.mask.length; i = i + 1) {
      if (this.options.mask[i] === '9') {
        maskGroups.push(/^[0-9]$/);

        this.default += '_';
      } else if (this.options.mask[i] === 'A') {
        maskGroups.push(/^[A-Za-zÀ-ÿ]$/);

        this.default += '_';
      } else {
        maskGroups.push(this.options.mask[i]);

        this.default += this.options.mask[i];
      }
    }

    return maskGroups;
  }
}
