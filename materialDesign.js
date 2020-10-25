

for (let rip of document.querySelectorAll('.mdc-button')){
    mdc.ripple.MDCRipple.attachTo(rip);
}

for (let txt of document.querySelectorAll('.mdc-text-field')) {
    mdc.textField.MDCTextField.attachTo(txt);
    mdc.ripple.MDCRipple.attachTo(txt);
}