# ControlBox
A convenient control box to adjust your values.

[API doc](https://necolo.github.io/ControlBox/modules/_main_.html)

# usage

## Initialization 
```js
const ControlBox = require('control-box').ControlBox;
const box = new ControlBox();
```

or with es6:
```js
import { ControlBox } from 'control-box';
const box = new ControlBox();
```

## context
ControlBox accepts context for saving local values:
```js
box.context['test'] = 'hhh';
```

## check box
```javascript
box.addCheckBox({
    label: 'something',
    onChange: (checked) => {
        if (checked) { ... }
        else { ... }
    },
});
```

## range box

Basic parameters:
```js
box.addRangeBox({
    label: 'something',
    onChange: (value) => { ... }
})
```
Option parameters:

parameter | Description | Default
--- | --- | ---
min | the minimum value of the rangebox | -10
max | the maximum value of the rangebox | 10
step | the value's granularity | 0.01
initValue | the value before u change the rangebox |  
turnBtn | add adjust buttons | undefined

** notes: **
- turnBtn accepts a number, which defines the granularity when you click the button. 

## text box
```js
box.addTextBox({
    label: 'something',
    onChange: (value) => { ... }
})
```

## select box
Basic parameters:
```js
box.addSelectBox({
    label: 'something',
    options: ['select1', 'select2', 'select3', 0.5, 10, true, false],
    onChange: (value) => { ... },
})
```

Option parameters:

parameter | description | default
--- | --- | ---
default | set the default value | undefined


## add a list of boxes

### a list of range boxes

`addRangeBoxList` needs two parameters: the spec of each range box, and the spec for all.  
Each box can define as `label: onChange`, or `label: {}` for individual spec. 

```js
box.addRangeBoxList ({
    'box1': (value) => { ... },
    'box2': {
        min: 1,
        max: 10,
        onChange: (value) => { ... },
    }
}, {
    min: -1,
    max: 1,
    step: 0.01,
    turnBtn: 0.001,
})
```