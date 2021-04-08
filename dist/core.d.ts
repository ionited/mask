export interface MaskOptions {
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
export declare class MaskCore {
    el: HTMLInputElement;
    options: MaskOptions;
    data: MaskData;
    private inputFunc;
    private formatFunc;
    constructor(el: HTMLInputElement, options: MaskOptions);
    private init;
    destroy(): void;
    private beforeInput;
    private input;
    private format;
    setCursorPosition(index: number, timeout?: number): void;
}
