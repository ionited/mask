export interface MaskOptions {
  instance: MaskCore;
  init?(data: MaskData): void;
  beforeInput?(data: MaskData): void;
  input?(data: MaskData): void;
  format(data: MaskData): void;
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
  private formatFunc = this.format.bind(this, true);

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

    this.init();
  }

  private init() {
    this.el.addEventListener('input', this.inputFunc);
    this.el.addEventListener('paste', this.inputFunc);
    this.el.addEventListener('focus', this.formatFunc);

    this.data.input = this.el.value;

    this.options.init && this.options.init(this.data);
    
    this.format();
  }

  destroy() {
    this.el.removeEventListener('input', this.inputFunc);
    this.el.removeEventListener('paste', this.inputFunc);
    this.el.removeEventListener('focus', this.formatFunc);
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

    this.dispatchEvent();
  }

  private format(focus = false) {
    this.data.focus = focus;

    this.options.format(this.data);

    this.el.value = this.data.output;

    this.setCursorPosition(this.data.cursorPosition, focus ? 25 : undefined);
  }

  private setCursorPosition(index: number, timeout: number = 0) {
    if (timeout) {
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
