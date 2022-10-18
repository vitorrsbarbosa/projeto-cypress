/// <reference types="cypress" />

describe('Scenarios where authentication is required', () => {
  let attachFile = true
  const file = 'example.json'
  const faker = require('faker')
  const updatedNote = faker.lorem.words(4)

  beforeEach('login', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    cy.intercept('POST', '**/prod/billing').as('postPaymentRequest')
    cy.login()
  })
  it('Should CRUD a simple note test', () => {
    const note = faker.lorem.words(4)
    // Create
    cy.visit('/notes/new')
    cy.get('#content').type(note)
    cy.contains('button', 'Create').click()
    cy.wait('@getNotes')
    cy.contains('.list-group-item', note)
      .should('be.visible')
    // Read
    cy.visit('/')
    cy.wait('@getNotes')
    cy.get('div[class=list-group]')
      .should('be.visible')
    // Update
    cy.contains('.list-group-item', note)
      .should('be.visible')
      .click()
    cy.wait('@getNote')
    cy.get('#content').clear().type(updatedNote)
    cy.contains('button', 'Save').click()
    cy.wait('@getNotes')
    cy.contains('.list-group-item', note)
      .should('not.exist')
    // Delete
    cy.contains('.list-group-item', updatedNote)
      .should('be.visible')
      .click()
    cy.wait('@getNote')
    cy.contains('button', 'Delete').click()
    cy.wait('@getNotes')
    cy.contains('.list-group-item', updatedNote).should('not.exist')
  })
  it('Should CRUD a note with an uploaded file segregated logic test', () => {
    const note = faker.lorem.words(4)
    cy.createNote(note, attachFile, file)
    cy.wait('@getNotes')
    cy.readNote()
    attachFile = false
    cy.updateNote(updatedNote, attachFile, file)
    cy.wait('@getNotes')
    cy.deleteNote(updatedNote)
  })
  it('Should create a note without a file', () => {
    const note = faker.lorem.words(4)
    attachFile = false
    cy.createNote(note, attachFile, file)
  })
  it('Should create a note with a file', () => {
    const note = faker.lorem.words(4)
    attachFile = true
    cy.createNote(note, attachFile, file)
  })
  it('Should read a list of notes', () => {
    cy.readNote()
  })
  it('Should update a note without a file', () => {
    attachFile = false
    cy.updateNote(updatedNote, attachFile, file)
  })
  it('Should update a note with a file', () => {
    attachFile = true
    cy.updateNote(updatedNote, attachFile, file)
  })
  it('Should delete a note', () => {
    cy.deleteNote(updatedNote)
  })
  it('Should successfully submit the form', () => {
    cy.fillSettingsFormAndSubmit()
    cy.wait('@getNotes')
    cy.wait('@postPaymentRequest').then(response => {
      expect(response.state).to.equal('Complete')
    })
  })
})