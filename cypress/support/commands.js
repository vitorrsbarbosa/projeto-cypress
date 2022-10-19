/// <reference types="cypress" />
/// <reference types="cypress-iframe" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.fillSecretField('#password', password)
  cy.fillSecretField('#confirmPassword', password)
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
})

Cypress.Commands.add('fillSecretField', (passwordField, passwordText) => {
  cy.get(passwordField).type(passwordText, { log: false })
})

// Cypress.Commands.add('login', (
//   login = Cypress.env('USER_EMAIL'),
//   password = Cypress.env('USER_PASSWORD')) => {
//   cy.visit('/login')
//   cy.get('#email').type(login)
//   cy.fillSecretField('#password', password)
//   cy.contains('button', 'Login').click()
//   cy.contains('h1', 'Your Notes').should('be.visible')
// })

Cypress.Commands.add('login', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD'),
  { cacheSession = true } = {}
) => {
  const login = () => {
    cy.visit('/login')
    cy.get('#email').type(username)
    cy.fillSecretField('#password', password)
    cy.contains('button', 'Login').click()
      .then(() => {
        cy.contains('h1', 'Your Notes').should('be.visible')
      })
  }

  if (cacheSession) {
    cy.session([username, password], login)
  } else {
    login()
  }
})

Cypress.Commands.add('createNote', (note, attachFile = false, file = null) => {
  cy.visit('/notes/new')
  cy.get('#content').type(note)
  attachFileHandler(attachFile, file)
  cy.contains('button', 'Create').click()
  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('readNote', () => {
  cy.visit('/')
  cy.get('div[class=list-group]').should('be.visible')
})

Cypress.Commands.add('updateNote', (newNote, attachFile = false, file = null) => {
  cy.visit('/')
  cy.get('.list-group-item').last().should('be.visible').click()

  cy.get('#content').then(($content) => {
    const txt = $content.text()
    cy.get('#content').clear()
      .type(newNote)
    attachFileHandler(attachFile, file)
    cy.contains('button', 'Save').click()
    cy.contains('.list-group-item', txt).should('not.exist')
    cy.contains('.list-group-item', newNote).should('be.visible')
  })
})

Cypress.Commands.add('deleteNote', (note) => {
  cy.visit('/')
  cy.contains('.list-group-item', note)
    .should('be.visible')
    .click()
  cy.contains('button', 'Delete')
    .click()
  cy.contains('.list-group-item', note)
    .should('not.exist')
})

const attachFileHandler = (attachFile, file) => {
  if (attachFile) {
    cy.get('#file').attachFile(file)
  }
}

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})

Cypress.Commands.add('validateViewport', () => {
  if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
    cy.get('button.navbar-toggle')
      .should('be.visible')
      .click()
  }
})