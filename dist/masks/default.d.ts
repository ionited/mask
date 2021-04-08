import { MaskData, MaskOptions } from '../core';
export declare class MaskDefault implements MaskOptions {
    firstInput: number;
    mask: string;
    maskGroups: any[];
    constructor(el: HTMLInputElement, mask: string);
    format(data: MaskData): void;
    private getMaskGroups;
}
