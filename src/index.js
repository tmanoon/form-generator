"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fieldsStack = [];
var dependantFields = [];
function createForm(fields) {
    fieldsStack = fields.filter(function (field) { return !field.fieldDependencies; });
    dependantFields = fields.filter(function (field) { return field.fieldDependencies; });
    var formEl = document.querySelector('.form');
    var form = '';
    for (var i = 0; i < fieldsStack.length; i++) {
        var currField = fieldsStack[i];
        if (currField.type !== 'checkbox')
            form += "<label for=\"".concat(currField.id, "\">").concat(currField.label, "</label>");
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
    return '<button class="submit-btn btn">Submit</button>';
}
function submitForm(e) {
    e.preventDefault();
    displayModal('rgb(95, 195, 95)', 'Form submitted');
}
function setSelectedOption(el, value) {
    Array.from(el.options).forEach(function (option) { return option.removeAttribute('selected'); });
    var selectedOption = Array.from(el.options).find(function (option) { return option.value === value; });
    if (selectedOption)
        selectedOption.setAttribute('selected', 'true');
}
function createCheckboxEl(field) {
    var checkboxStr = "<input type=\"checkbox\" id=\"".concat(field.id, "\" name=\"").concat(field.id, "\" onchange=\"setValue(event)\" ").concat(field.required ? 'required' : '');
    if (typeof field.defaultValue === 'boolean' && field.defaultValue)
        checkboxStr += ' checked';
    checkboxStr += ' />';
    checkboxStr += "<label for=\"".concat(field.id, "\">").concat(field.label, "</label>");
    return checkboxStr;
}
function createInputEl(field) {
    var inputStr = '<input ';
    inputStr += "type=\"".concat(field.type, "\" id=\"").concat(field.id, "\" name=\"").concat(field.id, "\" onchange=\"setValue(event)\"");
    if (field.defaultValue)
        inputStr += " value=\"".concat(field.defaultValue, "\"");
    if (field.required)
        inputStr += " required";
    if (field.validation) {
        if (field.validation.min && field.type === 'number')
            inputStr += " min=\"".concat(field.validation.min, "\"");
        if (field.validation.max && field.type === 'number')
            inputStr += " max=\"".concat(field.validation.max, "\"");
        if (field.validation.pattern)
            inputStr += " pattern=\"".concat(field.validation.pattern, "\"");
    }
    inputStr += " />";
    return inputStr;
}
function setValue(e) {
    var isDependant = false;
    var el = e.target;
    var id = el.id;
    var value = el.type === 'checkbox' ? el.checked : el.value;
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
        dependantFields.filter(function (field) { return field.fieldDependencies.some(function (dependency) { return dependency.id === id && dependency.value === value; }); }))
        isDependant = true;
    if (isDependant)
        checkForDependents(value, id);
}
function checkForDependents(value, id) {
    var formEl = document.querySelector('.form');
    if (dependantFields) {
        var relevantFields = dependantFields.filter(function (field) { return field.fieldDependencies.find(function (dependency) { return dependency.id === id; }); });
        relevantFields.forEach(function (field) {
            var _a, _b;
            var fieldElement = document.getElementById(field.id);
            var dependency = field.fieldDependencies.find(function (dep) { return dep.id === id; });
            if (fieldElement && dependency && dependency.value !== value) {
                (_a = formEl.querySelector("[for=".concat(field.id, "]"))) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = formEl.querySelector("#".concat(field.id))) === null || _b === void 0 ? void 0 : _b.remove();
            }
        });
        var elsStrToAdd = '';
        var fieldsToAdd = relevantFields.filter(function (field) { return field.fieldDependencies.some(function (dependency) { return dependency.id === id &&
            dependency.value === value && !document.getElementById(field.id); }); });
        for (var _i = 0, fieldsToAdd_1 = fieldsToAdd; _i < fieldsToAdd_1.length; _i++) {
            var field = fieldsToAdd_1[_i];
            if (field.type !== 'checkbox')
                elsStrToAdd += "<label for=\"".concat(field.id, "\">").concat(field.label, "</label>");
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
    var selectStr = "<select id=\"".concat(field.id, "\" name=\"").concat(field.id, "\" onchange=\"setValue(event)\">");
    if (field.validation.options) {
        for (var i = 0; i < field.validation.options.length; i++) {
            var currOption = field.validation.options[i];
            selectStr += "<option value=\"".concat(currOption, "\">").concat(currOption, "</option>");
        }
    }
    selectStr += '</select>';
    return selectStr;
}
function handleJSONFile() {
    var _a;
    var fileInput = document.getElementById('json-file');
    if (!fileInput)
        return displayModal('red', 'No JSON file provided');
    var file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return displayModal('red', 'No JSON file selected');
    var reader = new FileReader();
    reader.onload = function (event) {
        var _a;
        try {
            if (((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) && typeof event.target.result === 'string') {
                var jsonData = JSON.parse(event.target.result);
                var keyName = Object.keys(jsonData)[0];
                createForm(jsonData[keyName]);
            }
        }
        catch (error) {
            displayModal('red', "Invalid JSON file: ".concat(error));
        }
    };
    reader.readAsText(file);
    displayModal('rgb(95, 195, 95)', 'File uploaded successfully');
}
function closeModal() {
    var modalEl = document.querySelector('.modal');
    modalEl.style.display = 'none';
}
function displayModal(clr, txt) {
    var modalEl = document.querySelector('.modal');
    var pEl = modalEl.querySelector('p');
    modalEl.style.backgroundColor = clr;
    pEl.innerText = txt;
    modalEl.style.display = 'flex';
    setTimeout(function () {
        closeModal();
    }, 3000);
}
