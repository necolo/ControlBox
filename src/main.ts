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

export class ControlBox {
    public element:HTMLElement;
    private _contexts:{} = {};

    constructor() {
        const element = document.createElement('div');
        element.id = 'debugBox';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        element.style.position = 'fixed';
        element.style.left = '0';
        element.style.bottom = '48px';
        document.body.appendChild(element);

        this.element = element;
    }

    public setContext(name:string, data:any) {
        this._contexts[name] = data;
    }

    public context(name:string) : any {
        return this._contexts[name];
    }

    public addCheckBox (spec:{
        label:string,
        onChange:(checked:boolean) => void,
    }) {
        const input = document.createElement('input');
        this._initElement(spec, input);

        input.type = 'checkbox';
        input.onchange = (ev:any) => {
            if (ev.target) {
                return spec.onChange(ev.target.checked);
            }
        };
    }

    public addRangeBox(spec:RangeBoxSpecT_default) {
        const input = document.createElement('input');
        const box = this._initElement(spec, input);

        const min = (spec.min === undefined) ? -10 : spec.min; 
        const max = (spec.max === undefined) ? 10 : spec.max;
        const step = (spec.step === undefined) ? 0.01 : spec.step;
        const value = (spec.initValue === undefined) ? (min + max) / 2 : spec.initValue;

        if (spec.turnBtn) {
            const plus = turnBtn('+', () => {
                const value = (parseFloat(input.value) + spec.turnBtn!).toFixed(-Math.log10(step));
                changeValue(value.toString());
            });
            const minus = turnBtn('-', () => {
                const value = (parseFloat(input.value) - spec.turnBtn!).toFixed(-Math.log10(step));
                changeValue(value.toString());
            });
            box.appendChild(plus);
            box.appendChild(minus);
        }

        const span = document.createElement('span');
        span.style.color = 'white';
        box.appendChild(span);

        input.type = 'range';
        input.min = min.toString();
        input.max = max.toString();
        input.step = step.toString();
        input.value = value.toString();
        span.innerText = input.value;
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
            span.innerText = value;
            spec.onChange(parseFloat(value));
            input.value = value;
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
        onChange:(value) => void,
    }) {
        const input = document.createElement('input');
        this._initElement(spec, input);
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
        onChange:(value) => void,
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

        this._initElement(spec, select);
    }

    private _initElement (spec:any, actionElement:any) : HTMLElement {
        const box = document.createElement('div');
        const label = document.createElement('label');

        box.className = 'debugbox-action';
        box.style.width = '100%';
        box.style.margin = '10px';

        label.innerText = spec.label;
        label.style.color = 'white';

        actionElement.style.margin = '0 0 0 20px';

        box.appendChild(label);
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
