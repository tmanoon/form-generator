"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fieldsStack = [];
var dependantFields = [];
function createForm(fields) {
    toggleFormRequirements('off');
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
    updateStorage();
}
function toggleFormRequirements(mode) {
    const sectionEl = document.querySelector('.form-requirements');
    if (mode === 'off')
        sectionEl.style.display = 'none';
    else
        sectionEl.style.display = 'flex';
}
function getSubmitBtn() {
    return '<button class="submit-btn btn">Submit</button>';
}
function submitForm(e) {
    e.preventDefault();
    displayModal('rgb(95, 195, 95)', 'Form submitted');
}
function setSelectedOption(el, value) {
    Array.from(el.options).forEach(option => option.removeAttribute('selected'));
    const selectedOption = Array.from(el.options).find(option => option.value === value);
    if (selectedOption)
        selectedOption.setAttribute('selected', 'true');
}
function createCheckboxEl(field) {
    let checkboxStr = `<div class="checkbox-container flex"><input type="checkbox" id="${field.id}" name="${field.id}" onchange="setValue(event)" ${field.required ? 'required' : ''}`;
    if (typeof field.defaultValue === 'boolean' && field.defaultValue)
        checkboxStr += ' checked';
    checkboxStr += ' />';
    checkboxStr += `<label for="${field.id}">${field.label}</label></div>`;
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
            inputStr += ` pattern="${field.validation.pattern}" placeholder="Format ${field.validation.pattern}"`;
    }
    inputStr += ` />`;
    return inputStr;
}
function setValue(e) {
    let isDependant = false;
    const el = e.target;
    const id = el.id;
    const value = el.type === 'checkbox' ? el.checked : el.value;
    updateState(id, value);
    if (el.type === 'checkbox') {
        if (value.toString() === 'true')
            el.setAttribute('checked', value.toString());
        else
            el.removeAttribute('checked');
    }
    else
        el.setAttribute('value', value.toString());
    if (el.type === 'select-one')
        setSelectedOption(el, el.value);
    if (dependantFields &&
        dependantFields.filter(field => field.fieldDependencies.some(dependency => dependency.id === id && dependency.value === value)))
        isDependant = true;
    if (isDependant)
        checkForDependents(value, id);
}
function updateState(id, value) {
    const isDependant = dependantFields === null || dependantFields === void 0 ? void 0 : dependantFields.find(field => field.id === id);
    let fieldToUpdateIdx;
    if (isDependant) {
        fieldToUpdateIdx = dependantFields === null || dependantFields === void 0 ? void 0 : dependantFields.findIndex(field => field.id === id);
        dependantFields[fieldToUpdateIdx].value = value;
        console.log(dependantFields[fieldToUpdateIdx]);
    }
    else {
        fieldToUpdateIdx = fieldsStack.findIndex(field => field.id === id);
        fieldsStack[fieldToUpdateIdx].value = value;
        console.log(fieldsStack[fieldToUpdateIdx]);
    }
    updateStorage();
}
function updateStorage() {
    if (dependantFields === null || dependantFields === void 0 ? void 0 : dependantFields.length)
        localStorage.setItem('FIELD_KEY', JSON.stringify([...fieldsStack, ...dependantFields]));
    else
        localStorage.setItem('FIELD_KEY', JSON.stringify([...fieldsStack]));
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
        return displayModal('red', 'No JSON file provided');
    const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return displayModal('red', 'No JSON file selected');
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
            displayModal('red', `Invalid JSON file: ${error}`);
        }
    };
    reader.readAsText(file);
    displayModal('rgb(95, 195, 95)', 'File uploaded successfully');
}
function closeModal() {
    const modalEl = document.querySelector('.modal');
    modalEl.style.display = 'none';
}
function displayModal(clr, txt) {
    const modalEl = document.querySelector('.modal');
    const pEl = modalEl.querySelector('p');
    modalEl.style.backgroundColor = clr;
    pEl.innerText = txt;
    modalEl.style.display = 'flex';
    setTimeout(() => {
        closeModal();
    }, 3000);
}
