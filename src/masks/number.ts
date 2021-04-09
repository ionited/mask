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
    data.input = data.input ? data.input : `0${this.getDecimal()}`;
  }

  input(data: MaskData) {
    const input = data.input.replace(new RegExp(`[^0-9\\${this.options.decimalPoint}]`, 'g'), ''),
      decimal = input.indexOf(this.options.decimalPoint),
      integer = input.substring(0, decimal === -1 ? input.length : decimal).replace(/^0+/, '')
    ;

    data.input = input ? (
      decimal === -1 ? 
        `${integer ? integer : '0'}${this.getDecimal()}` :
        `${integer ? integer : '0'}${this.getDecimal(input.substr(decimal + 1, this.options.decimal))}`
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
      data.cursorPosition = data.output.length - (this.options.decimal + 1);
    } else if (data.cursorPosition < data.inputRaw.length - this.options.decimal) {
      data.cursorPosition = data.output.length - (data.inputRaw.length - data.cursorPosition);
    }
  }

  private getDecimal(decimal = '') {
    return `${this.options.decimal > 0 ? this.options.decimalPoint : ''}${decimal.padEnd(this.options.decimal, '0')}`;
  }
}
