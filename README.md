# ControlBox
A convenient control box to adjust your values.

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
