export interface MaskOptions {
  instance: MaskCore;
  init?(data: MaskData): void;
  input?(data: MaskData): void;
  format(data: MaskData): void;
  focus?(data: MaskData): void;
  blur?(data: MaskData): void;
  mouseover?(data: MaskData): void;
  mouseout?(data: MaskData): void;
}

export interface MaskData {
  cursor: { start: number, end: number };
  delete: boolean;
  focus: boolean;
  input: string;
  output: string;
  outputRaw: any;
}

export class MaskCore {
  el: HTMLInputElement;
  options: MaskOptions;
  data: MaskData;

  private inputFunc = this.input.bind(this);
  private focusFunc = this.focus.bind(this);
  private blurFunc = this.blur.bind(this);
  private mouseoverFunc = this.mouseover.bind(this);
  private mouseoutFunc = this.mouseout.bind(this);
  private isMobile = false;

  constructor(el: HTMLInputElement, options: MaskOptions) {
    this.el = el;
    this.options = options;

    this.data = {
      cursor: { start: el.selectionStart ?? el.value.length, end: el.selectionEnd ?? el.value.length },
      delete: false,
      focus: false,
      input: '',
      output: '',
      outputRaw: null
    }

    this.isMobile = /Android/i.test(navigator.userAgent);

    this.init();
  }

  private init() {
    this.el.addEventListener('input', this.inputFunc);
    this.el.addEventListener('focus', this.focusFunc);
    this.el.addEventListener('blur', this.blurFunc);
    this.el.addEventListener('mouseover', this.mouseoverFunc);
    this.el.addEventListener('mouseout', this.mouseoutFunc);

    this.data.input = this.el.value;

    this.options.init && this.options.init(this.data);
    
    this.el.value = this.data.output as string;

    this.update();
  }

  destroy() {
    this.el.removeEventListener('input', this.inputFunc);
    this.el.removeEventListener('focus', this.focusFunc);
    this.el.removeEventListener('blur', this.blurFunc);
    this.el.removeEventListener('mouseover', this.mouseoverFunc);
    this.el.removeEventListener('mouseout', this.mouseoutFunc);
  }

  private input(e: Event) {
    if ((e as any).__mask__) return e.preventDefault();
    else e.stopImmediatePropagation();

    this.data.delete = 
      (e as InputEvent).inputType === 'deleteContentBackward' ||
      (e as InputEvent).inputType === 'deleteContentForward';

    this.data.input = (e.target as HTMLInputElement).value;
    const cursor = {
      start: this.el.selectionStart ?? 0,
      end: this.el.selectionEnd ?? 0
    };

    this.data.cursor = cursor;

    this.options.input && this.options.input(this.data);

    if (this.data.cursor.start !== cursor.start || this.data.cursor.end !== cursor.end) this.setCursorPosition(this.data.cursor.start, this.data.cursor.end);

    this.format();
  }

  private format(focus = false) {
    this.data.focus = focus;

    this.options.format(this.data);

    this.update(focus, true, !focus);
  }

  private update(focus = false, changeCursor = true, emit = true) {
    if (this.data.output !== null) this.el.value = this.data.output;

    (this.el as any).valueRaw = this.data.outputRaw;

    if (changeCursor) this.setCursorPosition(this.data.cursor.start, this.data.cursor.end, focus ? 50 : undefined);

    if (emit) this.dispatchEvent();
  }

  private focus() {
    this.data.input = this.el.value;

    this.options.focus && this.options.focus(this.data);

    this.format(true);
  }

  private blur() {
    this.data.input = this.el.value;
    
    this.options.blur && this.options.blur(this.data);

    this.update(false, false, false);
  }

  private mouseover() {
    this.data.input = this.el.value;

    this.options.mouseover && this.options.mouseover(this.data);

    this.update(false, false, false);
  }

  private mouseout() {
    this.data.input = this.el.value;

    this.options.mouseout && this.options.mouseout(this.data);

    this.update(false, false, false);
  }

  private setCursorPosition(start: number, end: number, timeout?: number) {
    this.el.setSelectionRange(start, end);

    if (timeout || (this.isMobile && this.data.delete)) setTimeout(() => this.el.setSelectionRange(start, end), timeout);
  }

  private dispatchEvent() {
    const e = new Event('input');

    (e as any).__mask__ = true;

    this.el.dispatchEvent(e);
  }
}
