# Restaurant Forecasting App: Butch Cassidy Group

<img alt="GitHub contributors" src="https://img.shields.io/github/contributors-anon/WillemW-01/butch-cassidy"> <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/WillemW-01/butch-cassidy"> <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/WillemW-01/butch-cassidy"> <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/WillemW-01/butch-cassidy">

## Contents

[Project Description](#project-description
1.  [Problem](#problem)
2.  [Solution](#solution)

[Environment, Installation and Execution](#environment-installation-and-execution).

1. [Frontend](#frontend)

   1. [Environment](#environment)
   2. [Installation](#installation)
   3. [Execution](#execution)

2. [Backend](#backend)

   1. [Environment](#environment-1)
   2. [Installation](#installation-1)
   3. [Execution](#execution-1)

## Project Description

This project is a solution to the problem stipulated in the Standard Bank Lab Hackathon October 2022.

### Problem:

The problem set was a data set of two London-based Indian take-away restaurants including their set of orders over a time period of 2015-2019. The problem was to develop a forecasting solution to the given data set.


### Solution:


Our solution is a web-based application that acts like a dashboard for restaurant data with forecasting. The forecasting was done through a machine learning model (more details are described in the Jupyter Notebook). 

**Important note:**

In order to view the first restaurant's dataset, input "Blue Billie Jeans" as the restaurant name, and for the second dataset, "Red Butter Bus".

## Environment, Installation and Execution

The requirements and steps to run the program are described below.

## Frontend

### Environment:

---

- NodeJS (v16.15.0 or later)
- ReactJS (v18.2.0 or later)

### Installation

---

**Assuming NodeJS is not yet installed:**

Windows / MacOS:

1. Fetch the correct installer from: https://nodejs.org/en/download/
2. Run the installer and follow the steps onscreen
3. Verify installation by opening a terminal and typing: `$ npm -v`

Linux:

1. Open terminal and use package manager to install node:

   `$ sudo apt-get install nodejs`

2. Verify installation by typing: `$ npm -v`

**Once NodeJS is installed:**

1. Navigate to the frontend directory in terminal:

   `$ cd frontend`

2. Install all node packages and node modules (might take a while):

   `$ npm install`

3. All done. Nothing else needed for environment setup.

### Execution

---

1. Have a terminal open in the frontend directory
2. Simply type:

   `$ npm start`

   and the app will open in the default browser

3. Make sure the browser is full-screen and at 100% zoom

## Backend

### Environment:

---

- Python (v3.7 or later)

### Installation

---

**Assuming Python is not yet installed:**

Windows / MacOS:

1. Fetch the correct installer from: https://www.python.org/downloads/
2. Run the installer and follow the steps onscreen
3. Add the python command to the environment variables (windows only):

   1. Open the Windows Search function, and type "environment"
   2. Select the first option
   3. Click the button titled "Environment Variables" near the bottom of the popup
   4. Select the Variable labelled either "PATH" or "Path". If there is none, create one.
   5. Click the button titled "Edit"
   6. Enter the path of the python installation into the value field. For example:

      `C:\Users\User\AppData\Local\Programs\Python\Python310\`

   7. Click "OK" and close all the windows just opened

4. Verify installation by opening a terminal and typing:

   `$ python --version` , or if that does not work:

   `$ python3 --version`

Linux:

1. Python comes pre-installed on most linux distros
2. But to make sure, type:

   `$ sudo apt-get install python3`

**Once Python is installed:**

1. Navigate to the backend directory in terminal:

   `$ cd backend`

2. Install all python packages used in the project:

   `$ pip install -r "packages.txt"`, or:

   `$ pip3 install -r "packages.txt"`

3. All done. Nothing else needed for environment setup.

### Execution

---

1. Have a terminal open in the backend directory
2. Simply type (no need for virtual environments):

   `$ python manage.py runserver` or:

   `$ python3 manage.py runserver`

   and backend will run in the terminal
