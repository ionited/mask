import { MaskData, MaskCore, MaskOptions } from '../core';

interface MaskNumberOptions {
  decimal: number;
  decimalPoint: string;
  end: boolean;
  prefix: string;
  thousandPoint: string;
}

export class MaskNumber implements MaskOptions {
  instance: MaskCore;
  options: MaskNumberOptions = {
    decimal: 2,
    decimalPoint: ',',
    end: false,
    prefix: '',
    thousandPoint: '.'
  };

  constructor(el: HTMLInputElement, options: true | MaskNumberOptions) {
    if (typeof options === 'object') {
      this.options = {
        decimal: options.decimal ?? 2,
        decimalPoint: options.decimalPoint ? options.decimalPoint : ',',
        end: options.end ?? false,
        prefix: options.prefix ?? '',
        thousandPoint: options.thousandPoint ?? '.'
      };
    }

    this.instance = new MaskCore(el, this);
  }

  init(data: MaskData) {
    if (data.input) {
      data.input = data.input.replace(/\./g, this.options.decimalPoint);
      
      const decimal = data.input.indexOf(this.options.decimalPoint);

      data.input = `${data.input.substring(0, decimal === -1 ? data.input.length : decimal)}${this.getDecimal(decimal === -1 ? '' : data.input.substr(decimal + 1))}`;
    } else {
      data.input = `0${this.getDecimal()}`;
    }
  }

  format(data: MaskData) {
    let integer = '';

    if (this.options.end) {
      const input = data.input.replace(/[^0-9]/g, '');

      integer = input.substr(0, input.length - this.options.decimal).replace(/^0+/, '');

      data.input = `${integer ? integer : '0'}${this.getDecimal(input.substr(-this.options.decimal))}`;
    } else {
      const
        input = data.input.replace(new RegExp(`[^0-9\\${this.options.decimalPoint}]`, 'g'), ''),
        decimal = input.indexOf(this.options.decimalPoint)
      ;

      integer = input.substring(0, decimal === -1 ? input.length : decimal).replace(/^0+/, '');

      data.input = input ? (
        decimal === -1 ?
          `${integer ? integer.substr(0, integer.length - (this.options.decimal ?? 0)) : '0'}${this.getDecimal(integer.substr(-(this.options.decimal ?? 0)))}` :
          `${integer ? integer : '0'}${this.getDecimal(input.substr(decimal + 1))}`
      ) : `0${this.getDecimal()}`;

      data.input = data.input.split('').reverse().join('')
        .replace(this.options.decimalPoint, '#')
        .split('').reverse().join('')
        .replace(new RegExp(`\\${this.options.decimal}`, 'g'), '').replace('#', this.options.decimalPoint)
      ;
    }

    data.output = this.options.prefix + data.input.replace(new RegExp(`\\d(?=(\\d{3})+\\${this.options.decimalPoint})`, 'g'), `$&${this.options.thousandPoint}`);

    if (data.focus) {
      data.cursorPosition = this.options.end ? data.output.length : data.output.length - (this.options.decimal + (this.options.decimal ? 1 : 0));
    } else if (data.cursorPosition < data.inputRaw.length - this.options.decimal) {
      let cursorPosition = data.output.length - (data.inputRaw.length - data.cursorPosition);

      cursorPosition = cursorPosition < 0 ? 0 : cursorPosition;

      data.cursorPosition = data.delete ? Math.min(data.cursorPosition, cursorPosition) : cursorPosition;

      if (data.cursorPosition < this.options.prefix.length + 1) {
        data.cursorPosition = this.options.prefix.length + (integer ? 0 : 1);
      }
    } else if (this.options.end) {
      data.cursorPosition = data.output.length - (data.inputRaw.length - data.cursorPosition);
    }
  }

  private getDecimal(decimal = '') {
    return `${this.options.decimal > 0 ? this.options.decimalPoint : ''}${(decimal.length > this.options.decimal ? decimal.substr(0, this.options.decimal) : decimal).padEnd(this.options.decimal, '0')}`;
  }
}
