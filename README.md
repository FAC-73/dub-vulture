# dub-vulture
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<br />

A Content Management System built using node, inquirer, and MySQL. An application for managing a company's employees using node, inquirer, and MySQL.


## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

![Employee Tracker App](https://github.com/FAC-73/dub-vulture/blob/main/Assets/Demo.png?raw=true)
<br />

## User Story

```
AS A small business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Minimum Requirements

* Functional application.

* GitHub repository with a unique name and a README describing the project.

* The command-line application should allow users to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles


## Bonus

* The command-line application should allow users to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
  

## Description

A CMS that allows a manager to add departments, roles, employees, view departments, roles, employees as well as update them. Bonus functionality includes the ability to update employee managers, view employees by manager and delete department, roles and employees. You can also view the total budget of a department through a function that combines all salaries of employess in that department. This application utilizes inquirer for prompting the user input, mySQL for creating the schema, organizing and joining data. As well as console.table for formatting the table in terminal/bash. 

## Installation
Clone the repo to your local development environment.

```md
git clone https://github.com/FAC-73/dub-vulture.git
```
Navigate to the dub-vulture folder directory using the command prompt.

Run `npm install` to install all dependencies. To use the application locally, run `node server.js` in terminal or bash, and then open http://localhost:3000 [or whatever terminal port you have specified] in your preferred browser. 

## Usage
Launch the [app ](https://pure-stream-99195.herokuapp.com/)

![Note taker app with express.js](https://github.com/FAC-73/dub-vulture/blob/main/Assets/Screenshot-of-app.png?raw=true)
<br />
1. Click the `get started` button to navigate to the `/notes' route
<br />

![Create note](https://github.com/FAC-73/dub-vulture/blob/main/Assets/Create-new.png?raw=true)
<br />

2. In the notes page add text into the *Note title* and *Note text* fields
<br />

![Save note](https://github.com/FAC-73/dub-vulture/blob/main/Assets/Save-note.png?raw=true)
<br />

3. Once both inputs have been filled out a *save button* should appear in the top right corner
4. Click save to save the note
5. The saved note is appended to the list on the left
<br />

![Edit note](https://github.com/FAC-73/dub-vulture/blob/main/Assets/Edit-item.png?raw=true)
<br />

6. To edit a note click on any of the items in the list and edit the input text, click save to save changes
<br />

![Delete note](https://github.com/FAC-73/dub-vulture/blob/main/Assets/Delete-item.png?raw=true)
<br />

7. To delete, use the delete button on each list item.


## Licence
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<br />

## Contributing
[Kay Davis](https://github.com/FAC-73)
<br />

## Built with
- [Javascript](https://www.w3schools.com/jsref/default.asp)
- [Node.js](https://nodejs.org/en/)
- [Inquirer](https://www.npmjs.com/package/inquirer/v/0.2.3)
- [Console.table](https://www.npmjs.com/package/console.table)
- [JSON](https://www.json.org/json-en.html)

## Questions?

### GitHub Username:
[FAC-73](https://github.com/FAC-73)

###  ✉️ Email me:
[kaydavis21@googlemail.com](mailto:kaydavis21@googlemail.com)

### 📁 GitHub project repo:
[https://github.com/FAC-73/dub-vulture](https://github.com/FAC-73/dub-vulture)

### 🔗 Deployed application:
[https://pure-stream-99195.herokuapp.com/](https://pure-stream-99195.herokuapp.com/)
