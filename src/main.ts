class ControlBox {
    public element:HTMLElement;

    constructor() {
        const element = document.createElement('div');
        element.id = 'debugBox';
        element.style.width = '250px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        element.style.position = 'fixed';
        element.style.left = '0';
        element.style.bottom = '48px';
        document.body.appendChild(element);

        this.element = element;
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

    public addRangeBox(spec:{
        label:string,
        min?:number,
        max:number,
        step?:number,
        onChange:(value) => void,
    }) {
        const input = document.createElement('input');
        this._initElement(spec, input);

        const min = spec.min || 0;
        const max = spec.max;
        const step = spec.step || 0.1;

        input.type = 'range';
        input.min = min.toString();
        input.max = max.toString();
        input.step = step.toString();
        input.onchange = (ev:any) => {
            if (ev.target && ev.target.value) {
                return spec.onChange(ev.target.value);
            }
        };
        input.oninput = (ev:any) => {
            if (ev.target && ev.target.value) {
                return spec.onChange(ev.target.value);
            }
        };
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
        options:string[],
        onChange:(value) => void,
    }) {
        const select = document.createElement('Select');
        spec.options.map((value) => {
            const option = document.createElement('option');
            option.value = value;
            option.innerText = value;
            select.appendChild(option);
        });
        select.onchange = (ev:any) => {
            if (ev.target && ev.target.value) {
                spec.onChange(ev.target.value);
            }
        };

        this._initElement(spec, select);
    }

    private _initElement (spec:any, actionElement:any) {
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
    }
}

module.exports = ControlBox;
