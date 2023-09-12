import { MaskData, MaskCore, MaskOptions } from '../core';

interface MaskNumberOptions {
  allowEmpty: boolean;
  allowNegative: boolean;
  decimal: number;
  decimalPoint: string;
  end: boolean;
  prefix: string;
  thousandPoint: string;
}

export class MaskNumber implements MaskOptions {
  instance: MaskCore;
  options: MaskNumberOptions = {
    allowEmpty: false,
    allowNegative: false,
    decimal: 2,
    decimalPoint: ',',
    end: false,
    prefix: '',
    thousandPoint: '.'
  }

  private default = '';

  constructor(el: HTMLInputElement, options: true | MaskNumberOptions) {
    if (typeof options === 'object')
      this.options = {
        allowEmpty: options.allowEmpty,
        allowNegative: options.allowNegative,
        decimal: options.decimal ?? 2,
        decimalPoint: options.decimalPoint ? options.decimalPoint : ',',
        end: options.end ?? false,
        prefix: options.prefix ?? '',
        thousandPoint: options.thousandPoint ?? '.'
      }

    this.default = `0${this.getDecimal()}`;
    this.instance = new MaskCore(el, this);
  }

  init(data: MaskData) {
    if (data.input || !this.options.allowEmpty) {
      if (data.input) {
        data.input = data.input.replace(/\./g, this.options.decimalPoint);
      
        const decimal = data.input.indexOf(this.options.decimalPoint);

        data.input = `${data.input.substring(0, decimal === -1 ? data.input.length : decimal)}${this.getDecimal(decimal === -1 ? '' : data.input.substring(decimal + 1))}`;
      } else data.input = `0${this.getDecimal()}`;
    
      this.format(data);

      if (this.options.allowEmpty && data.output === this.default) data.output = '';
    }
  }

  format(data: MaskData) {
    const isNegative = this.options.allowNegative && data.input.indexOf('-') != -1;

    let integer = '';

    if (this.options.end) {
      const input = data.input.replace(/[^0-9]/g, '');

      integer = input.substring(0, input.length - this.options.decimal).replace(/^0+/, '');

      data.input = `${integer ? integer : '0'}${this.getDecimal(input.slice(-this.options.decimal))}`;
    } else {
      const
        input = data.input.replace(new RegExp(`[^0-9\\${this.options.decimalPoint}]`, 'g'), ''),
        decimal = input.indexOf(this.options.decimalPoint);

      integer = input.substring(0, decimal === -1 ? input.length : decimal).replace(/^0+/, '');

      data.input = input ? (
        decimal === -1 ?
          `${integer ? integer.substring(0, integer.length - (this.options.decimal ?? 0)) : '0'}${this.getDecimal(integer.slice(-(this.options.decimal ?? 0)))}` :
          `${integer ? integer : '0'}${this.getDecimal(input.substring(decimal + 1))}`
      ) : `0${this.getDecimal()}`;

      data.input = data.input.split('').reverse().join('')
        .replace(this.options.decimalPoint, '#')
        .split('').reverse().join('')
        .replace(new RegExp(`\\${this.options.decimal}`, 'g'), '').replace('#', this.options.decimalPoint);
    }

    data.output = (isNegative ? '-' : '') + this.options.prefix + data.input.replace(new RegExp(`\\d(?=(\\d{3})+\\${this.options.decimalPoint})`, 'g'), `$&${this.options.thousandPoint}`);

    if (data.focus) data.cursorPosition = this.options.end ? data.output.length : data.output.length - (this.options.decimal + (this.options.decimal ? 1 : 0));
    else if (data.cursorPosition < data.inputRaw.length - this.options.decimal) {
      let cursorPosition = data.output.length - (data.inputRaw.length - data.cursorPosition);

      cursorPosition = cursorPosition < 0 ? 0 : cursorPosition;

      data.cursorPosition = data.delete ? Math.min(data.cursorPosition, cursorPosition) : cursorPosition;

      if (data.cursorPosition < this.options.prefix.length + 1) data.cursorPosition = this.options.prefix.length + (integer ? 0 : 1);
    } else if (this.options.end) {
      data.cursorPosition = data.output.length - (data.inputRaw.length - data.cursorPosition);

      if (data.output[data.cursorPosition - 1]?.match(/[^0-9]/)) data.cursorPosition = data.cursorPosition - 1;
    }
  }

  blur(data: MaskData) {
    if (this.options.allowEmpty && data.input === this.default) data.output = '';
  }

  mouseover(data: MaskData) {
    this.format(data);
  }

  mouseout(data: MaskData) {
    if (this.options.allowEmpty && data.input === this.default && document.activeElement != this.instance.el) data.output = '';
  }

  private getDecimal(decimal = '') {
    return `${this.options.decimal > 0 ? this.options.decimalPoint : ''}${(decimal.length > this.options.decimal ? decimal.substring(0, this.options.decimal) : decimal).padEnd(this.options.decimal, '0')}`;
  }
}
