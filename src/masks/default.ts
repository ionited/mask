import { MaskData, MaskCore, MaskOptions } from '../core';

interface MaskDefaultOptions {
  allowEmpty?: boolean;
  mask: string;
}

export class MaskDefault implements MaskOptions {
  
  instance: MaskCore;
  firstInput = 0;
  maskGroups: any[];
  options: MaskDefaultOptions = {
    allowEmpty: false,
    mask: ''
  };

  private default = '';

  constructor(el: HTMLInputElement, options: string | MaskDefaultOptions) {
    if (typeof options === 'object')
      this.options = {
        allowEmpty: options.allowEmpty,
        mask: options.mask
      };
    else
      this.options = {
        allowEmpty: false,
        mask: options
      };

    this.maskGroups = this.getMaskGroups();

    this.instance = new MaskCore(el, this);
  }

  init(data: MaskData) {
    if (data.input || !this.options.allowEmpty) this.format(data);
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

        if (valid)lastValidIndex = index + 1;
        else if (!firstInvalidIndex) firstInvalidIndex = index;

        if (!this.firstInput) this.firstInput = index;
      } else val = val + m;
    });

    data.output = val;
    data.cursorPosition = data.delete ? Math.max(this.firstInput, data.cursorPosition) : Math.max(firstInvalidIndex, lastValidIndex);
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
