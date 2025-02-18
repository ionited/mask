import { MaskData, MaskCore, MaskOptions } from '../core';

interface MaskDateOptions {
  format: string;
  placeholders: { [key: string]: string };
}

export class MaskDate implements MaskOptions {
  groups: string[] = [];
  instance: MaskCore;
  options: MaskDateOptions = {
    format: '',
    placeholders: {
      'YYYY': '',
      'MM': '',
      'DD': '',
      'hh': '',
      'mm': '',
      'ss': ''
    }
  };
  formats: { [key: string]: { min: number, max: number | null, maxFirstNumber: number | null } } = {
    'YYYY': {
      min: 0,
      max: null,
      maxFirstNumber: null
    },
    'MM': {
      min: 1,
      max: 12,
      maxFirstNumber: 1
    },
    'DD': {
      min: 1,
      max: 31,
      maxFirstNumber: 3
    },
    'hh': {
      min: 0,
      max: 23,
      maxFirstNumber: 2
    },
    'mm': {
      min: 0,
      max: 59,
      maxFirstNumber: 5
    },
    'ss': {
      min: 0,
      max: 59,
      maxFirstNumber: 5
    }
  }

  constructor(el: HTMLInputElement, options: string | MaskDateOptions) {
    if (typeof options === 'object') this.options = options;
    else this.options.format = options;

    this.groups = this.getGroups();
    this.instance = new MaskCore(el, this);
  }

  format(data: MaskData) {
    let
      output = '',
      start = 0;

    for (let i = 0; i < this.groups.length; i++) {
      const input = data.input.slice(start, start + this.groups[i].length + 1).replace(/\D/g, '');

      output += this.formats[this.groups[i]] ?
        input.padEnd(this.groups[i].length, this.getPlaceholder(this.groups[i])[0]).slice(0, this.groups[i].length) :
        this.groups[i]
      ;

      start += this.groups[i].length;
    }

    output = this.checkGroups(output);

    const { date, val } = this.checkDate(output);

    output = val;

    data.output = output;
    data.outputRaw = date;

    if (!data.delete) {
      let
        cursor = 0,
        valid = false;

      for (let i = 0; i < data.output.length; i++) {
        let
          group = '',
          start = 0;

        for (let j = 0; j < this.groups.length; j++) {
          if (i >= start && i < start + this.groups[j].length) {
            group = this.groups[j];
            break;
          }

          start += this.groups[j].length;
        }

        if (this.formats[group]) {
          if (/\d/.test(data.output[i])) {
            cursor = i + 1;
            valid = true;
          } else  valid = false;
        } else if (valid) cursor = i + 1;
      }

      data.cursor = { start: cursor, end: cursor };
    }
  }

  keydown(e: KeyboardEvent, data: MaskData) {
    if (e.key === 'ArrowDown') {
      let
        group,
        start = 0;

      for (let i = 0; i < this.groups.length; i++) {
        if (data.cursor.end <= start + this.groups[i].length && this.formats[this.groups[i]]) {
          group = this.groups[i];
          break;
        }

        start += this.groups[i].length;
      }

      if (group && this.formats[group]) {
        e.preventDefault();

        const
          value = data.input.slice(start, start + group.length),
          int = parseInt(value);

        let dec = isNaN(int) ? group === 'YYYY' ? new Date().getFullYear() + 1 : this.formats[group].min : int;

        dec--;

        const max = this.formats[group].max;

        if (dec < this.formats[group].min && max) dec = max;

        data.output = data.input.slice(0, start) + dec.toString().padStart(group.length, '0') + data.input.slice(start + group.length);
        
        const { date, val } = this.checkDate(data.output);

        data.output = val;
        data.outputRaw = date;
        
        data.cursor = { start, end: start + group.length };
        data.delete = true;
      }
    }

    if (e.key === 'ArrowUp') {
      let
        group,
        start = 0;

      for (let i = 0; i < this.groups.length; i++) {
        if (data.cursor.end <= start + this.groups[i].length && this.formats[this.groups[i]]) {
          group = this.groups[i];
          break;
        }

        start += this.groups[i].length;
      }

      if (group && this.formats[group]) {
        e.preventDefault();

        const
          value = data.input.slice(start, start + group.length),
          int = parseInt(value);

        let inc = isNaN(int) ? group === 'YYYY' ? new Date().getFullYear() - 1 : this.formats[group].min === 1 ? 0 : this.formats[group].min : int;

        inc++;

        const max = this.formats[group].max;

        data.output = data.input.slice(0, start) + Math.max(this.formats[group].min, max ? inc % (max + 1) : inc).toString().padStart(group.length, '0') + data.input.slice(start + group.length);
        
        const { date, val } = this.checkDate(data.output);

        let output = val;

        if (group === 'DD' && inc > parseInt(val.slice(start, start + group.length))) output = output.slice(0, start) + this.formats[group].min.toString().padStart(group.length, '0') + output.slice(start + group.length);

        data.output = output;
        data.outputRaw = date;
        
        data.cursor = { start, end: start + group.length };
        data.delete = true;
      }
    }

    if (e.key === 'Tab') {
      let
        group,
        start = 0;

      if (e.shiftKey) {
        start = this.groups.reduce((value, g) => value += g.length, 0);

        for (let i = this.groups.length - 1; i >= 0; i--) {
          if (data.cursor.start > start - this.groups[i].length && this.formats[this.groups[i]]) {
            group = this.groups[i];
            break;
          }
  
          start -= this.groups[i].length;
        }

        if (group) {
          e.preventDefault();
  
          data.cursor = { start: start - group.length, end: start }
        }
      } else {
        for (let i = 0; i < this.groups.length; i++) {
          if (data.cursor.end < start + this.groups[i].length && this.formats[this.groups[i]]) {
            group = this.groups[i];
            break;
          }
  
          start += this.groups[i].length;
        }

        if (group) {
          e.preventDefault();
  
          data.cursor = { start, end: start + group.length }
        }
      }
    }
  }

  checkGroups(output: string) {
    let
      val = '',
      start = 0;

    for (let i = 0; i < this.groups.length; i++) {
      const
        group = output.slice(start, start + this.groups[i].length).replace(/\D/g, ''),
        format = this.formats[this.groups[i]];

      if (format) {
        if (group) {
          let g = group;

          if (format.maxFirstNumber && parseInt(g[0]) > format.maxFirstNumber) g = format.maxFirstNumber.toString();

          if (group.length === this.groups[i].length) {
            let int = parseInt(group);

            if (int < format.min) int = format.min;
            else if (format.max && int > format.max) int = format.max;

            g = int.toString().padStart(this.groups[i].length, '0');
          }

          val += (g + this.groups[i]).slice(0, this.groups[i].length);
        } else val += this.getPlaceholder(this.groups[i]);
      } else val += this.groups[i];

      start += this.groups[i].length;
    }

    return val;
  }

  checkDate(output: string) {
    const parts: { [key: string]: string | null } = {
      'YYYY': null,
      'MM': null,
      'DD': null,
      'hh': null,
      'mm': null,
      'ss': null
    }

    let
      complete = true,
      start = 0,
      date = null,
      val = output;

    for (let i = 0; i < this.groups.length; i++) {
      const value = output.slice(start, start + this.groups[i].length)

      if (this.formats[this.groups[i]]) {
        if (/^[0-9]+$/.test(value)) {
          if (!parts[this.groups[i]]) parts[this.groups[i]] = value;
        } else {
          complete = false;
          break;
        }
      }

      start += this.groups[i].length;
    }

    if (complete) {
      const d = new Date(`${parts['YYYY'] ?? '1970'}-${parts['MM'] ?? '01'}-${parts['DD'] ?? '01'}T${parts['hh'] ?? '00'}:${parts['mm'] ?? '00'}:${parts['ss'] ?? '00'}`);

      if (d.getMonth() !== parseInt(parts['MM'] ?? '01') - 1) {
        d.setDate(0);

        const day = ('0' + d.getDate()).slice(-2);

        let start = 0;

        val = '';

        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i] === 'DD') val += day;
          else val += output.slice(start, start + this.groups[i].length);

          start += this.groups[i].length;
        }
      }

      date = d.toISOString();
    }

    return { date, val }
  }

  init(data: MaskData) {
    this.format(data);
  }

  getGroups() {
    const groups = [];

    for (let i = 0; i < this.options.format.length; i++) {
      if (this.options.format.slice(i, i + 4) === 'YYYY') {
        groups.push('YYYY');

        i = i + 3;
      } else if (this.formats[this.options.format.slice(i, i + 2)]) {
        groups.push(this.options.format.slice(i, i + 2));

        i++;
      } else groups.push(this.options.format[i]);
    }

    return groups;
  }

  private getPlaceholder(group: string) {
    return this.options.placeholders[group] ? this.options.placeholders[group] : group;
  }
}
