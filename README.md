# Form Generator

Form Generator is a dynamic form-building project that allows users to render customizable forms based on JSON configuration files.
It supports field dependencies, validations, and multiple input types, offering flexibility for various form structures.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Technical Choices](#technical-choices)
- [Assumptions](#assumptions)
- [JSON Configuration Examples](#json-configuration-examples)
- [Credits](#credits)
- [Contact](#contact)


## Features

- **Dynamic Form Creation**: Build forms from JSON configurations that specify field types, dependencies, and validation requirements.
- **Field Dependency Handling**: Display or hide dependent fields based on selected values.
- **Validation**: Set validations for fields, such as minimum and maximum values or regex patterns.
- **Customizable Input Types**: Supports text, number, select, and checkbox fields.

## Technologies Used

- **Core Technologies**: HTML, CSS, TypeScript
- **Project Tooling**: TypeScript Compiler (TSC) for file compilation

## Setup Instructions

This project is designed to be hosted on GitHub Pages.
 To get started, follow these steps:

1. **Clone the repository:**
   - git clone https://github.com/your-username/form-generator.git
2. **Navigate to the project folder:**
    - cd form-generator
3. **Download all the necessary dependencies:**
    - npm i
4. **Compile TypeScript to JavaScript:**
   - tsc
5. **Use LiveServer extension in VSCode to use it locally**

## Usage

1. **Select a JSON configuration file:**
    - Upload a JSON file with form fields and dependencies (examples provided below).
2. **Render the form:**
    - Based on the uploaded JSON, the form will dynamically render fields, handle dependencies, and apply validations.
3. **Submit the form:**
    - Once filled, submit to test validation and dependency functionality.

## Technical Choices

In this project, I explored JavaScript and TypeScript beyond frameworks, manually managing file compilation and setup. This approach provided me an opportunity to understand the inner workings of form rendering and dependencies without relying on libraries, and to build custom validation and dependency checks.
I adapted the code to support a range of fields and dependencies, adding thorough checks in each function to ensure correct and timely rendering.

## Assumptions 
Creating this project gave me new insight into the complexity of front-end frameworks. Ensuring each component renders in sequence and without errors requires a significant amount of configuration and testing, which frameworks often simplify.

In this pure JavaScript and TypeScript approach, I added custom attribute checks to prevent rendering issues and maintain form integrity.

## Credits

Special thanks for [HugeIcons](https://hugeicons.com/) for providing me the favicon of this page.

## Contact

**Shoval Sabag**
[GitHub](https://github.com/tmanoon)
[LinkedIn](https://www.linkedin.com/in/shoval-sabag-2b2305308)