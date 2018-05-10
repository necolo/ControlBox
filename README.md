# ControlBox
A convenient control box to adjust your values.

[API doc](https://necolo.github.io/ControlBox/modules/_main_.html)

# usage
```javascript
const ControlBox = require('control-box');

const box = new ControlBox();

box.addCheckBox({
    label: 'checkbox',
    onChange: (checked) => {},
});

box.addRangeBox({
    label: 'range box',
    onChange: (value) => {},
});
```
