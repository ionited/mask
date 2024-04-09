import { MaskData, MaskCore, MaskOptions } from '../core';

interface MaskDefaultOptions {
  allowEmpty?: boolean;
  mask: RegExp | string;
}

export class MaskDefault implements MaskOptions {
  instance: MaskCore;
  maskGroups: { pattern: RegExp | string, default: string, maxLength: number | null, minLength: number, value: string }[];
  options: MaskDefaultOptions = {
    allowEmpty: false,
    mask: ''
  }

  private default = '';

  constructor(el: HTMLInputElement, options: RegExp | string | MaskDefaultOptions) {
    if (typeof options === 'string' || options instanceof RegExp)
      this.options = {
        allowEmpty: false,
        mask: options as string
      }
    else
      this.options = {
        allowEmpty: (options as MaskDefaultOptions).allowEmpty,
        mask: (options as MaskDefaultOptions).mask
      }

    this.maskGroups = this.getMaskGroups();
    this.instance = new MaskCore(el, this);
  }

  init(data: MaskData) {
    if (data.input || !this.options.allowEmpty) this.format(data);
    else data.output = '';
  }

  format(data: MaskData) {
    let i = 0;

    for (let gi = 0; gi < this.maskGroups.length; gi++) {
      const g = this.maskGroups[gi];

      let val = '';

      if (g.pattern instanceof RegExp) {
        for (; i < data.input.length; i++) {
          if (g.maxLength && val.length >= g.maxLength) break;

          if (g.pattern.test(val + data.input[i])) val += data.input[i];
        }
      } else val = g.pattern;

      this.maskGroups[gi].value = val;
    }

    const rmg = this.maskGroups.filter(g => g.pattern instanceof RegExp);

    for (let i = rmg.length - 1; i >= 0; i--) {
      if (rmg[i].value.length > rmg[i].minLength) break;

      let valid = false;

      do {
        valid =
          rmg[i - 1] && rmg[i - 1].value.length > rmg[i - 1].minLength &&
          (rmg[i].pattern as RegExp).test(rmg[i].value + rmg[i - 1].value.slice(-1))
        ;

        if (valid) {
          rmg[i].value =  rmg[i - 1].value.slice(-1) + rmg[i].value;
          rmg[i - 1].value = rmg[i - 1].value.slice(0, -1);
        }
      } while (valid);

      if (rmg[i].value.length > rmg[i].minLength) i += 2;
    }

    let rmgI = 0;

    this.maskGroups.map(g => {
      if (g.pattern instanceof RegExp) {
        rmgI++;

        return rmg[rmgI]
      } else return g;
    });

    let
      cursorPosition = 0,
      firstValidPosition = null;

    for (const g of this.maskGroups) {
      if (firstValidPosition === null && g.pattern instanceof RegExp) firstValidPosition = cursorPosition;

      cursorPosition += g.value.length;

      if (g.value.length < g.minLength) break;
    }

    data.output = this.maskGroups.map(g => {
      let placeholder = '';

      for (let i = g.value.length; i < g.minLength; i++) placeholder += g.default;

      return g.value + placeholder;
    }).join('');
    data.cursorPosition = data.delete ? Math.max(data.cursorPosition, firstValidPosition ?? 0) : cursorPosition;
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
  
  private getMaskGroups() {
    const
      regex = (this.options.mask instanceof RegExp ? this.options.mask : this.getRegex(this.options.mask))
        .toString()
        .replace(/(^\/\^?|\$?\/$)/g, '')
        .replace(/]\+/g, ']*')
        .replace(/]{([0-9]+)}/g, ']{0,$1}'),
      groups = [];

    let
      group = '',
      open = 0;

    for (let i = 0; i < regex.length; i++) {
      const token = regex[i];

      if (token === '\\' && !open) {
        i++;

        groups.push({
          pattern: regex[i],
          default: regex[i],
          maxLength: 1,
          minLength: 1,
          value: ''
        });

        this.default += regex[i];
      } else if (token === '(' || token === '[' || token === '{') {
        open++;
        group += token;
      } else if (token === ')' || token === ']') {
        open--;
        group += token;
      } else if (token === '}') {
        open--;
        group += token;

        if (!open) {
          const length = group.match(/{([0-9]+),([0-9]+)}/);

          if (length && length[1] !== '0') group = group.replace(/{[0-9]+,([0-9]+)}/, '{0,$1}');

          groups.push({
            pattern: new RegExp(`^${group}$`),
            default: '_',
            maxLength: length ? length[2] as any : 1,
            minLength: length && length[1] !== '0' ? length[1] as any : length ? length[2] : 1,
            value: ''
          });
          group = '';

          this.default += '_'.repeat(length && length[1] !== '0' ? length[1] as any : length ? length[2] : 1);
        }
      } else if (token === '*' && !open) {
        group += token;

        groups.push({
          pattern: new RegExp(`^${group}$`),
          default: '_',
          maxLength: null,
          minLength: 1,
          value: ''
        });
        group = '';

        this.default += '_';
      } else if (open > 0) group += token;
      else {
        groups.push({
          pattern: token,
          default: token,
          maxLength: 1,
          minLength: 1,
          value: ''
        });

        this.default += token;
      }
    }

    return groups;
  }

  private getRegex(pattern: string) {
    return new RegExp(pattern.split('').map(p => {
      if (p === '9') return '[0-9]{1}';
      else if (p === 'A') return '[A-Za-zÀ-ÿ]{1}';
      else if (['(', ')', '[', ']'].indexOf(p) !== -1) return `\\${p}`;
      else return p;
    }).join(''));
  }
}
