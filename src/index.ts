import { FormField } from "./models/form.field.model"

var fieldsStack: FormField[] = []
var dependantFields: FormField[] | null = []

function createForm(fields: FormField[]) {
    fieldsStack = fields.filter(field => !field.fieldDependencies)
    dependantFields = fields.filter(field => field.fieldDependencies)
    const formEl = document.querySelector('.form') as Element
    let form = ''
    for (let i = 0; i < fieldsStack.length; i++) {
        const currField = fieldsStack[i]
        if (currField.type !== 'checkbox') form += `<label for="${currField.id}">${currField.label}</label>`
        else form += createCheckboxEl(currField)
        if (currField.type !== 'select') form += createInputEl(currField)
        else form += createSelectEl(currField)
    }
    formEl.innerHTML = form
        + getSubmitBtn()
}

function getSubmitBtn() {
    return '<button class="submit-btn">Submit</button>'
}

function submitForm(e: Event) {
    e.preventDefault()
    alert('Form submitted successfully!')
}

function setSelectedOption(el: HTMLSelectElement, value: string) {
    Array.from(el.options).forEach(option => option.removeAttribute('selected'));
    const selectedOption = Array.from(el.options).find(option => option.value === value);
    if (selectedOption) selectedOption.setAttribute('selected', 'true');
}

function createCheckboxEl(field: FormField) {
    let checkboxStr = `<input type="checkbox" id="${field.id}" name="${field.id}" onchange="setValue(event)" ${field.required ? 'required' : ''}`
    if (typeof field.defaultValue === 'boolean' && field.defaultValue) checkboxStr += ' checked'
    checkboxStr += ' />'
    checkboxStr += `<label for="${field.id}">${field.label}</label>`
    return checkboxStr
}

function createInputEl(field: FormField) {
    let inputStr = '<input '
    inputStr += `type="${field.type}" id="${field.id}" name="${field.id}" onchange="setValue(event)"`
    if (field.defaultValue) inputStr += ` value="${field.defaultValue}"`
    if (field.required) inputStr += ` required`
    if (field.validation) {
        if (field.validation.min && field.type === 'number') inputStr += ` min="${field.validation.min}"`
        if (field.validation.max && field.type === 'number') inputStr += ` max="${field.validation.max}"`
        if (field.validation.pattern) inputStr += ` pattern="${field.validation.pattern}"`
    }
    inputStr += ` />`
    return inputStr
}

function setValue(e: Event) {
    let isDependant = false
    const el = e.target as HTMLInputElement | HTMLSelectElement;
    const id = el.id;
    const value = el.type === 'checkbox' ? el.checked : el.value;
    el.setAttribute('value', el.value.toString())
    if (el.type === 'select-one') setSelectedOption(el as HTMLSelectElement, el.value)
    if (dependantFields &&
        dependantFields.filter(field => field.fieldDependencies!.some(dependency => dependency.id === id && dependency.value === value))) isDependant = true
    if (isDependant) checkForDependents(value, id)
}

function checkForDependents(value: string | number | boolean, id: string) {

    const formEl = document.querySelector('.form') as Element
    if (dependantFields) {
        let relevantFields = dependantFields.filter(field => field.fieldDependencies!.find(dependency => dependency.id === id))
        relevantFields.forEach(field => {
            const fieldElement = document.getElementById(field.id);
            const dependency = field.fieldDependencies!.find(dep => dep.id === id);
            if (fieldElement && dependency && dependency.value !== value) {
                formEl.querySelector(`[for=${field.id}]`)?.remove();
                formEl.querySelector(`#${field.id}`)?.remove();
            }
        });
        let elsStrToAdd = ''
        let fieldsToAdd = relevantFields.filter(field => field.fieldDependencies!.some(dependency => dependency.id === id && 
            dependency.value === value && !document.getElementById(field.id)))
        for (const field of fieldsToAdd) {
            if (field.type !== 'checkbox') elsStrToAdd += `<label for="${field.id}">${field.label}</label>`
            else elsStrToAdd += createCheckboxEl(field)
            if (field.type !== 'select' && field.type !== 'checkbox') elsStrToAdd += createInputEl(field)
            else if (field.type === 'select') elsStrToAdd += createSelectEl(field)
        }
        formEl.querySelector('button')!.remove()
        console.log(elsStrToAdd)
        formEl.innerHTML += elsStrToAdd + getSubmitBtn()
    }
}

function createSelectEl(field: FormField) {
    let selectStr = `<select id="${field.id}" name="${field.id}" onchange="setValue(event)">`
    if (field.validation!.options) {
        for (let i = 0; i < field.validation!.options.length; i++) {
            const currOption = field.validation!.options[i]
            selectStr += `<option value="${currOption}">${currOption}</option>`
        }
    }
    selectStr += '</select>'
    return selectStr
}

function handleJSONFile() {
    const fileInput = document.getElementById('json-file') as HTMLInputElement | null;
    if (!fileInput) return alert('No JSON file provided') // MAKE MODAL
    const file = fileInput.files?.[0] as Blob;
    if (!file) return alert('No JSON file selected'); // MAKE MODAL
    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            if (event.target?.result && typeof event.target.result === 'string') {
                const jsonData = JSON.parse(event.target.result);
                const keyName = Object.keys(jsonData)[0]
                createForm(jsonData[keyName]);
            }
        } catch (error) {
            console.error('Invalid JSON file:', error);
        }
    };
    reader.readAsText(file);
}