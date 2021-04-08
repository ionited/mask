import { MaskData, MaskOptions } from '../core';
interface MaskNumberOptions {
    decimal: number;
    decimalPoint: string;
    prefix: string;
    thousandPoint: string;
}
export declare class MaskNumber implements MaskOptions {
    options: MaskNumberOptions;
    constructor(el: HTMLInputElement, options: true | MaskNumberOptions);
    init(data: MaskData): void;
    input(data: MaskData): void;
    format(data: MaskData): void;
    private getDecimal;
}
export {};
