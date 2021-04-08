import { MaskDefault } from './masks/default';
import { MaskNumber } from './masks/number';

function Mask(el: HTMLInputElement, options: any) {
    for (let o in options) {
        if (Mask.masks[o]) {
            return new Mask.masks[o](el, options[o]);
        }
    }
}

Mask.masks = {} as any;

Mask.register = function(name: string, mask: any) {
    this.masks[name] = mask;
}

Mask.register('mask', MaskDefault);
Mask.register('number', MaskNumber);

(window as any).Mask = Mask;
