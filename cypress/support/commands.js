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
    cy.contains('h1', 'Your Notes').should('be.visible')
  }

  if (cacheSession) {
    cy.session([username, password], login)
  } else {
    login()
  }
})

Cypress.Commands.add('createNote', (note, attachFile = false, file) => {
  attachFile = false
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.intercept('GET', '**/notes/**').as('getNote')
  cy.visit('/notes/new')
  cy.wait('@getNote')
  cy.get('#content').type(note)
  attachFileHandler(attachFile, file)
  cy.contains('button', 'Create').click()
  cy.wait('@getNotes')
})

Cypress.Commands.add('readNote', () => {

})

Cypress.Commands.add('updateNote', (note, newNote, attachFile = false, file) => {
  attachFile = true
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.intercept('GET', '**/notes/**').as('getNote')
  cy.visit('/notes')
  cy.contains('.list-group-item', note).should('be.visible').click()
  cy.wait('@getNote')
  cy.get('#content')
    .clear()
    .type(newNote)
  attachFileHandler(attachFile, file)
  cy.contains('button', 'Save').click()
  cy.wait('@getNotes')
  cy.contains('.list-group-item', note).should('not.exist')
  cy.contains('.list-group-item', newNote).should('be.visible')
})

Cypress.Commands.add('deleteNote', (newNote) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.intercept('GET', '**/notes/**').as('getNote')
  cy.visit('/notes')
  cy.contains('.list-group-item', newNote).should('be.visible').click()
  cy.wait('@getNote')
  cy.contains('button', 'Delete').click()
  cy.wait('@getNotes')
  cy.contains('.list-group-item', newNote).should('not.exist')
})

const attachFileHandler = (attachFile, file) => {
  if (attachFile) {
    cy.get('#file').attachFile(file)
  }
}