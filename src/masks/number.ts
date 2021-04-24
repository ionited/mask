import { MaskData, MaskCore, MaskOptions } from '../core';

interface MaskNumberOptions {
  decimal: number;
  decimalPoint: string;
  prefix: string;
  thousandPoint: string;
}

export class MaskNumber implements MaskOptions {
  instance: MaskCore;
  options: MaskNumberOptions = {
    decimal: 2,
    decimalPoint: ',',
    prefix: '',
    thousandPoint: '.'
  };
  
  private integer: string | null = null;

  constructor(el: HTMLInputElement, options: true | MaskNumberOptions) {
    if (typeof options === 'object') {
      this.options = {
        decimal: options.decimal ?? 2,
        decimalPoint: options.decimalPoint ? options.decimalPoint : ',',
        prefix: options.prefix ?? '',
        thousandPoint: options.thousandPoint ?? '.'
      };
    }

    this.instance = new MaskCore(el, this);
  }

  init(data: MaskData) {
    data.input = data.input ? data.input.replace(/\./g, this.options.decimalPoint) : `0${this.getDecimal()}`;

    this.input(data);
  }

  input(data: MaskData) {
    const input = data.input.replace(new RegExp(`[^0-9\\${this.options.decimalPoint}]`, 'g'), ''),
      decimal = input.indexOf(this.options.decimalPoint),
      integer = input.substring(0, decimal === -1 ? input.length : decimal).replace(/^0+/, '')
    ;

    this.integer = integer;

    data.input = input ? (
      decimal === -1 ? 
        `${integer ? integer : '0'}${this.getDecimal()}`
        : `${integer ? integer : '0'}${this.getDecimal(input.substr(decimal + 1, this.options.decimal))}`
    ) : `0${this.getDecimal()}`;
  }

  format(data: MaskData) {
    let value = data.input;

    value = value.split('').reverse().join('')
      .replace(this.options.decimalPoint, '#')
      .split('').reverse().join('')
      .replace(new RegExp(`\\${this.options.decimal}`, 'g'), '').replace('#', this.options.decimalPoint)
    ;

    data.output = this.options.prefix + value.replace(new RegExp(`\\d(?=(\\d{3})+\\${this.options.decimalPoint})`, 'g'), `$&${this.options.thousandPoint}`);

    if (data.focus) {
      data.cursorPosition = data.output.length - (this.options.decimal + (this.options.decimal ? 1 : 0));
    } else if (data.cursorPosition < data.inputRaw.length - this.options.decimal || !this.options.decimal) {
      let cursorPosition = data.output.length - (data.inputRaw.length - data.cursorPosition);

      cursorPosition = cursorPosition < 0 ? 0 : cursorPosition;

      data.cursorPosition = data.delete ? Math.min(data.cursorPosition, cursorPosition) : cursorPosition;

      if (data.cursorPosition < this.options.prefix.length + 1) {
        data.cursorPosition = this.options.prefix.length + (this.integer ? 0 : 1);
      }
    }
  }

  private getDecimal(decimal = '') {
    return `${this.options.decimal > 0 ? this.options.decimalPoint : ''}${decimal.padEnd(this.options.decimal, '0')}`;
  }
}
