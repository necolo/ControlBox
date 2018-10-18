export interface RangeBoxSpecT_min {
    min?:number;
    max?:number;
    step?:number;
    initValue?:number;
    turnBtn?:number;
}

export interface RangeBoxSpecT_default extends RangeBoxSpecT_min {
    label:string;
    onChange:(value:number) => void;
}

export interface RangeBoxSpecT_list_per extends RangeBoxSpecT_min {
    onChange:(value:number) => void;
}

export interface RangeBoxSpecT_list_multi extends RangeBoxSpecT_min {
    label_prefix?:string;
}

export interface BoxSpec {
    styles?:{[name:string]:string};
}

export class ControlBox {
    public element:HTMLElement;
    public context:{} = {};

    constructor(spec:BoxSpec = {}) {
        const element = document.createElement('div');
        element.id = 'debugBox';

        const defaultStyles = {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            left: '0',
            bottom: '48px',
        }
        Object.assign(element.style, spec.styles || defaultStyles);

        document.body.appendChild(element);
        this.element = element;
    }

    public addCheckBox (spec:{
        label:string,
        onChange:(checked:boolean) => void,
    }) {
        const input = document.createElement('input');
        this._initElement(spec.label, input);

        input.type = 'checkbox';
        input.onchange = (ev:any) => {
            if (ev.target) {
                return spec.onChange(ev.target.checked);
            }
        };
    }

    public addRangeBox(spec:RangeBoxSpecT_default) {
        const input = document.createElement('input');
        const box = this._initElement(spec.label, input);

        const min = (spec.min === undefined) ? -10 : spec.min; 
        const max = (spec.max === undefined) ? 10 : spec.max;
        const step = (spec.step === undefined) ? 0.01 : spec.step;
        const value = (spec.initValue === undefined) ? (min + max) / 2 : spec.initValue;

        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.onchange = (ev:any) => {
            if (ev.target && ev.target.value) {
                changeValue(ev.target.value);
            }
        }
        numberInput.style.marginLeft = '2px';
        numberInput.style.width = '50px';
        box.appendChild(numberInput);

        // add turn buttons
        if (spec.turnBtn) {
            const plus = turnBtn('+', () => {
                const value = (parseFloat(input.value) + spec.turnBtn!).toFixed(-Math.log10(step));
                changeValue(value.toString());
            });
            plus.style.marginLeft = '2px';
            const minus = turnBtn('-', () => {
                const value = (parseFloat(input.value) - spec.turnBtn!).toFixed(-Math.log10(step));
                changeValue(value.toString());
            });
            box.appendChild(plus);
            box.appendChild(minus);
        }

        input.type = 'range';
        input.min = min.toString();
        input.max = max.toString();
        input.step = step.toString();
        input.value = value.toString();
        numberInput.value = input.value;
        input.onchange = (ev:any) => {
            if (ev.target && ev.target.value) {
                changeValue(ev.target.value);
            }
        };
        input.oninput = (ev:any) => {
            if (ev.target && ev.target.value) {
                changeValue(ev.target.value);
            }
        };

        function changeValue (value:string) {
            spec.onChange(parseFloat(value));
            input.value = value;
            numberInput.value = value;
        }

        function turnBtn (name:string, onClick:() => void) : HTMLButtonElement {
            const btn = document.createElement('button');
            btn.innerText = name; 
            btn.onclick = onClick;
            return btn;
        }
    }

    public addRangeBoxList (boxes:{
        [label:string]: ((value:number) => void) | RangeBoxSpecT_list_per,
    }, _spec?:RangeBoxSpecT_list_multi) {
        const spec_multi:RangeBoxSpecT_default = {} as RangeBoxSpecT_default;

        let prefix = '';
        if (_spec) {
            prefix = _spec.label_prefix || '';
            updateObj(spec_multi, _spec, {
                exclude: ['label_prefix'],
            });
        }

        const boxLabels = Object.keys(boxes);
        for (let i = 0; i < boxLabels.length; i ++) {
            const label = boxLabels[i];
            const specs = boxes[label];

            const spec_per:RangeBoxSpecT_default = JSON.parse(JSON.stringify(spec_multi));
            spec_per.label = prefix + label;
            if (typeof specs === 'function') {
                spec_per.onChange = specs;
            } else {
                updateObj(spec_per, specs);
            }
            this.addRangeBox(spec_per);
        }
    }

    public addTextBox(spec:{
        label:string,
        onChange:(value:string) => void,
    }) {
        const input = document.createElement('input');
        this._initElement(spec.label, input);
        input.type = 'text';

        let value = input.value;
        setInterval(
            () => {
                if (value !== input.value) {
                    value = input.value;
                    spec.onChange(value);
                }
            },
            100);
    }

    public addSelectBox(spec:{
        label:string,
        options:(string|number|boolean)[],
        onChange:(value:any) => void,
        default?:string|number|boolean,
    }) {
        const select = document.createElement('select');
        spec.options.map((value) => {
            const option = document.createElement('option');
            if (typeof value === 'number' || typeof value === 'boolean') {
                value = value.toString();;
            } 
            option.value = value;
            option.innerText = value;
            select.appendChild(option);
        });

        if (spec.default !== undefined) {
            select.value = spec.default.toString();
        } 

        select.onchange = (ev:any) => {
            if (ev.target && ev.target.value) {
                spec.onChange(ev.target.value);
            }
        };

        this._initElement(spec.label, select);
    }

    public addColorBox (spec:{
        label:string,
        onChange:(res:{color:number[], hex:string}) => void,
        range?:number, // 1, 15, 255
    }) {
        const colorInput = document.createElement('input');
        const box = this._initElement(spec.label, colorInput);
        colorInput.type = 'color';

        const range = spec.range || 1;

        const color = [0, 0, 0, 1];
        const r = createNumberInput((v) => color[0] = v, color[0]);
        const g = createNumberInput((v) => color[1] = v, color[1]);
        const b = createNumberInput((v) => color[2] = v, color[2]);
        const a = createNumberInput((v) => color[3] = v, color[3]);

        colorInput.onchange = (ev:any) => {
            if (ev.target && ev.target.value) {
                console.log(ev.target.value);
                const _color = colorToFloat(ev.target.value);
                color[0] = _color[0];
                color[1] = _color[1];
                color[2] = _color[2];
                r.value = (color[0] * range).toString();
                g.value = (color[1] * range).toString();
                b.value = (color[2] * range).toString();
                handleChange(ev.target.value);
            }
        }

        function createNumberInput (onchange:(v:number) => void, initValue = 0) {
            const numberInput = document.createElement('input');
            numberInput.type = 'number';
            numberInput.style.width = '45px';
            numberInput.value = initValue.toString();
            numberInput.onchange = _handleChange;
            numberInput.oninput = _handleChange;
            numberInput.style.marginLeft = '2px';
            box.appendChild(numberInput);

            function _handleChange (ev:any) {
                if (ev.target && ev.target.value) {
                    let v = parseFloat(ev.target.value);
                    v = Math.max(Math.min(range, v), 0);
                    numberInput.value = v.toString();
                    onchange(v / range);
                    colorInput.value = vec3ToColor(color);
                    handleChange();
                }
            }
            return numberInput;
        }

        function handleChange (_hex?:string) {
            spec.onChange({
                color: [color[0] * range, color[1] * range, color[2] * range, color[3]],
                hex: _hex || vec3ToColor(color),
            });
        }
    }

    private _initElement (label:string, actionElement:any) : HTMLElement {
        const box = document.createElement('div');
        const labelEl = document.createElement('label');

        box.className = 'debugbox-action';
        box.style.width = '100%';
        box.style.margin = '10px';

        labelEl.innerText = label;
        labelEl.style.color = 'white';

        actionElement.style.margin = '0 0 0 20px';

        box.appendChild(labelEl);
        box.appendChild(actionElement);
        this.element.appendChild(box);
        return box;
    }
}

function updateObj(original, target, option?:{exclude: string[]}) {
    const props = Object.keys(target);
    for (let i = 0; i < props.length; i ++) {
        const id = props[i];
        if (option && option.exclude && option.exclude.indexOf(id) > -1) {
            continue;
        } 
        original[id] = target[id];
    }
}

function floatToHex (x:number) {
    const y = (Math.round(255 * x) | 0).toString(16);
    if (y.length < 2) {
        return '0' + y;
    }
    return y;
}

function vec3ToColor (x:number[]) {
    return '#' + floatToHex(x[0]) + floatToHex(x[1]) + floatToHex(x[2]);
}

function colorToFloat (color:string) : [number, number, number] {
    const r = parseInt(color.substring(1, 3), 16) / 255;
    const g = parseInt(color.substring(3, 5), 16) / 255;
    const b = parseInt(color.substring(5, 7), 16) / 255;
    return [r, g, b];
}