# Testes _end-to-end_ com Cypress

[![CONTINUOUS INTEGRATION](https://github.com/vitorrsbarbosa/projeto-cypress/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vitorrsbarbosa/projeto-cypress/actions/workflows/ci.yml)

Project to demonstrate end-to-end (e2e) tests written using Cypress and running on a Continuous Integration service.

## Pre-requirements

To run this project you'll need the following:

- [git](https://git-scm.com/downloads) (Currently using version `2.38.1.windows.1` while writing the document)
- [nodejs](https://nodejs.org) (Currently using version `14.17.3`)
- NPM (Currently using version `6.14.13`)
- [Microsoft Edge](https://www.microsoft.com/en-us/edge)(Currently using version `106.0.1370.47)

**Note:** When installing nodejs, NPM is automatically installed too.

## Installation

To install the dev dependencies, run `npm install` (`npm i` for short)

## Configuring the environment variables

Before running the tests, some environment variables need to be set up.

Make a copy of the [`cypress.env.example.json`](./cypress.env.example.json) file as `cypress.env.json`, and set the appropriate values for all the variables.

**Note:** `cypress.env.json` file is not tracked by git.

## Running the tests

In this project, you can run tests in interactive and headless modes, and on desktop and tablet viewports.

### Headless mode

Run `npm test` (or `npm t` for short) to run all tests in headless mode using a desktop viewport.

Run `npm run test:tablet` to run the appropriate tests in headless mode using a tablet viewport.

### Interactive mode

Run `npm run cy:open` to open the Cypress Test Runner to run tests in interactive mode using a desktop viewport.

Run `npm run cy:open:tablet` to open the Cypress Test Runner to run tests in interactive mode using a tablet viewport.

___

Made with ❤️ by [Vitor Barbosa](https://github.com/vitorrsbarbosa).
