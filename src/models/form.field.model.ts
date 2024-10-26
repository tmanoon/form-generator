import { FieldDependency } from "./field.dependency.model";

export interface FormField {
    id: string;
    type: 'text' | 'number' | 'select' | 'checkbox' | 'email';
    label: string;
    required?: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        options?: string[];
    };
    defaultValue?: string | number | boolean;
    fieldDependencies?: FieldDependency[], // An interface I created to describe the field and its value/values
    value?: string | boolean 
}