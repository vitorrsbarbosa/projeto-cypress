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