export interface MaskOptions {
  instance: MaskCore;
  init?(data: MaskData): void;
  beforeInput?(data: MaskData): void;
  input?(data: MaskData): void;
  format(data: MaskData): void;
  focus?(data: MaskData): void;
  blur?(data: MaskData): void;
  mouseover?(data: MaskData): void;
  mouseout?(data: MaskData): void;
}

export interface MaskData {
  cursorPosition: number;
  delete: boolean;
  focus: boolean;
  input: string;
  inputRaw: string;
  output: string;
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
      cursorPosition: el.selectionStart ?? el.value.length,
      delete: false,
      focus: false,
      input: '',
      inputRaw: '',
      output: ''
    };

    this.isMobile = /Android/i.test(navigator.userAgent);

    this.init();
  }

  private init() {
    this.el.addEventListener('input', this.inputFunc);
    this.el.addEventListener('paste', this.inputFunc);
    this.el.addEventListener('focus', this.focusFunc);
    this.el.addEventListener('blur', this.blurFunc);
    this.el.addEventListener('mouseover', this.mouseoverFunc);
    this.el.addEventListener('mouseout', this.mouseoutFunc);

    this.data.input = this.el.value;

    this.options.init && this.options.init(this.data);
    
    this.format();
  }

  destroy() {
    this.el.removeEventListener('input', this.inputFunc);
    this.el.removeEventListener('paste', this.inputFunc);
    this.el.removeEventListener('focus', this.focusFunc);
    this.el.removeEventListener('blur', this.blurFunc);
    this.el.removeEventListener('mouseover', this.mouseoverFunc);
    this.el.removeEventListener('mouseout', this.mouseoutFunc);
  }

  private beforeInput() {
    const cursorPosition = this.data.cursorPosition = this.el.selectionStart ?? 0;

    this.options.beforeInput && this.options.beforeInput(this.data);

    if (this.data.cursorPosition != cursorPosition) {
      this.setCursorPosition(this.data.cursorPosition);
    }
  }

  private input(e: Event) {
    if ((e as any).__mask__) {
      return e.preventDefault();
    }

    this.data.delete = 
      (e as InputEvent).inputType === 'deleteContentBackward' ||
      (e as InputEvent).inputType === 'deleteContentForward'
    ;

    this.beforeInput();

    this.data.inputRaw = this.data.input = (e.target as HTMLInputElement).value;
    const cursorPosition = this.data.cursorPosition = this.el.selectionStart ?? 0;

    this.options.input && this.options.input(this.data);

    if (this.data.cursorPosition != cursorPosition) {
      this.setCursorPosition(this.data.cursorPosition);
    }

    this.format();
  }

  private format(focus = false) {
    this.data.focus = focus;

    if (focus) {
      this.data.input = this.el.value;
    }

    this.options.format(this.data);

    this.update(true);
  }

  private update(focus = false) {
    this.el.value = this.data.output;

    this.setCursorPosition(this.data.cursorPosition, focus ? 25 : undefined);

    if (!focus) {
      this.dispatchEvent();
    }
  }

  private focus() {
    this.options.focus && this.options.focus(this.data);

    this.format(true);
  }

  private blur() {
    this.options.blur && this.options.blur(this.data);

    this.update();
  }

  private mouseover() {
    this.options.mouseover && this.options.mouseover(this.data);

    this.update();
  }

  private mouseout() {
    this.options.mouseout && this.options.mouseout(this.data);

    this.update();
  }

  private setCursorPosition(index: number, timeout?: number) {
    if (timeout || (this.isMobile && this.data.delete)) {
      setTimeout(() => this.el.setSelectionRange(index, index), timeout);
    } else {
      this.el.setSelectionRange(index, index);
    }
  }

  private dispatchEvent() {
    const event = document.createEvent('Event');
    
    event.initEvent('input', true, true);
    (event as any).value = this.data.output;
    (event as any).__mask__ = true;

    this.el.dispatchEvent(event);
  }
}
