"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fieldsStack = [];
var dependantFields = [];
function createForm(fields) {
    fieldsStack = fields.filter(field => !field.fieldDependencies);
    dependantFields = fields.filter(field => field.fieldDependencies);
    const formEl = document.querySelector('.form');
    let form = '';
    for (let i = 0; i < fieldsStack.length; i++) {
        const currField = fieldsStack[i];
        if (currField.type !== 'checkbox')
            form += `<label for="${currField.id}">${currField.label}</label>`;
        else
            form += createCheckboxEl(currField);
        if (currField.type !== 'select')
            form += createInputEl(currField);
        else
            form += createSelectEl(currField);
    }
    formEl.innerHTML = form
        + getSubmitBtn();
}
function getSubmitBtn() {
    return '<button class="submit-btn">Submit</button>';
}
function submitForm(e) {
    e.preventDefault();
    alert('Form submitted successfully!');
}
function setSelectedOption(el, value) {
    Array.from(el.options).forEach(option => option.removeAttribute('selected'));
    const selectedOption = Array.from(el.options).find(option => option.value === value);
    if (selectedOption)
        selectedOption.setAttribute('selected', 'true');
}
function createCheckboxEl(field) {
    let checkboxStr = `<input type="checkbox" id="${field.id}" name="${field.id}" onchange="setValue(event)" ${field.required ? 'required' : ''}`;
    if (typeof field.defaultValue === 'boolean' && field.defaultValue)
        checkboxStr += ' checked';
    checkboxStr += ' />';
    checkboxStr += `<label for="${field.id}">${field.label}</label>`;
    return checkboxStr;
}
function createInputEl(field) {
    let inputStr = '<input ';
    inputStr += `type="${field.type}" id="${field.id}" name="${field.id}" onchange="setValue(event)"`;
    if (field.defaultValue)
        inputStr += ` value="${field.defaultValue}"`;
    if (field.required)
        inputStr += ` required`;
    if (field.validation) {
        if (field.validation.min && field.type === 'number')
            inputStr += ` min="${field.validation.min}"`;
        if (field.validation.max && field.type === 'number')
            inputStr += ` max="${field.validation.max}"`;
        if (field.validation.pattern)
            inputStr += ` pattern="${field.validation.pattern}"`;
    }
    inputStr += ` />`;
    return inputStr;
}
function setValue(e) {
    let isDependant = false;
    const el = e.target;
    const id = el.id;
    const value = el.type === 'checkbox' ? el.checked : el.value;
    el.setAttribute('value', el.value.toString());
    if (el.type === 'select-one')
        setSelectedOption(el, el.value);
    if (dependantFields &&
        dependantFields.filter(field => field.fieldDependencies.some(dependency => dependency.id === id && dependency.value === value)))
        isDependant = true;
    if (isDependant)
        checkForDependents(value, id);
}
function checkForDependents(value, id) {
    const formEl = document.querySelector('.form');
    if (dependantFields) {
        let relevantFields = dependantFields.filter(field => field.fieldDependencies.find(dependency => dependency.id === id));
        relevantFields.forEach(field => {
            var _a, _b;
            const fieldElement = document.getElementById(field.id);
            const dependency = field.fieldDependencies.find(dep => dep.id === id);
            if (fieldElement && dependency && dependency.value !== value) {
                (_a = formEl.querySelector(`[for=${field.id}]`)) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = formEl.querySelector(`#${field.id}`)) === null || _b === void 0 ? void 0 : _b.remove();
            }
        });
        let elsStrToAdd = '';
        let fieldsToAdd = relevantFields.filter(field => field.fieldDependencies.some(dependency => dependency.id === id &&
            dependency.value === value && !document.getElementById(field.id)));
        for (const field of fieldsToAdd) {
            if (field.type !== 'checkbox')
                elsStrToAdd += `<label for="${field.id}">${field.label}</label>`;
            else
                elsStrToAdd += createCheckboxEl(field);
            if (field.type !== 'select' && field.type !== 'checkbox')
                elsStrToAdd += createInputEl(field);
            else if (field.type === 'select')
                elsStrToAdd += createSelectEl(field);
        }
        formEl.querySelector('button').remove();
        console.log(elsStrToAdd);
        formEl.innerHTML += elsStrToAdd + getSubmitBtn();
    }
}
function createSelectEl(field) {
    let selectStr = `<select id="${field.id}" name="${field.id}" onchange="setValue(event)">`;
    if (field.validation.options) {
        for (let i = 0; i < field.validation.options.length; i++) {
            const currOption = field.validation.options[i];
            selectStr += `<option value="${currOption}">${currOption}</option>`;
        }
    }
    selectStr += '</select>';
    return selectStr;
}
function handleJSONFile() {
    var _a;
    const fileInput = document.getElementById('json-file');
    if (!fileInput)
        return alert('No JSON file provided'); // MAKE MODAL
    const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return alert('No JSON file selected'); // MAKE MODAL
    const reader = new FileReader();
    reader.onload = function (event) {
        var _a;
        try {
            if (((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) && typeof event.target.result === 'string') {
                const jsonData = JSON.parse(event.target.result);
                const keyName = Object.keys(jsonData)[0];
                createForm(jsonData[keyName]);
            }
        }
        catch (error) {
            console.error('Invalid JSON file:', error);
        }
    };
    reader.readAsText(file);
}
