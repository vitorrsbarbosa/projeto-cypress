/// <reference types="cypress" />

context('CRUD', () => {
  const faker = require('faker')
  let attachFile = true
  const file = 'example.json'
  const noteDescription = faker.lorem.words(4)
  const updatedNoteDescription = faker.lorem.words(4)

  beforeEach('login', () => {
    cy.login()
  })
  it('Should CRUD a simple note test', () => {

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')

    cy.visit('/notes/new')
    cy.get('#content').type(noteDescription)
    cy.contains('button', 'Create').click()

    cy.wait('@getNotes')
    cy.contains('.list-group-item', noteDescription)
      .should('be.visible')
      .click()
    cy.wait('@getNote')

    const updatedNoteDescription = faker.lorem.words(4)
    cy.get('#content').clear().type(updatedNoteDescription)
    cy.contains('button', 'Save').click()
    cy.wait('@getNotes')

    cy.contains('.list-group-item', noteDescription)
      .should('not.exist')
    cy.contains('.list-group-item', updatedNoteDescription)
      .should('be.visible')
      .click()

    cy.wait('@getNote')
    cy.contains('button', 'Delete').click()

    cy.wait('@getNotes')
    cy.contains('.list-group-item', updatedNoteDescription).should('not.exist')

  })
  it('Should CRUD a note with an uploaded file segregated logic test', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    cy.createNote(noteDescription, attachFile, file)
    cy.updateNote(noteDescription, updatedNoteDescription, attachFile, file)
    cy.deleteNote(updatedNoteDescription)
  })
  it('Should create a note without a file', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    attachFile = false
    cy.createNote(noteDescription, attachFile, file)
  })
  it('Should create a note with a file', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    attachFile = true
    cy.createNote(noteDescription, attachFile, file)
  })
  it('Should update a note without a file', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    attachFile = false
    cy.wait('@getNotes')
    cy.updateNote(noteDescription, updatedNoteDescription, attachFile, file)
  })
  it('Should update a note with a file', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    attachFile = true
    cy.wait('@getNotes')
    cy.updateNote(noteDescription, updatedNoteDescription, attachFile, file)
  })
  it('Should delete a note', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    cy.wait('@getNotes')
    cy.deleteNote()
  })
})