const BASE_URL = 'http://localhost:3000';

describe('Tests d\'authentification', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it('Devrait afficher la page de connexion', () => {
    cy.contains('div', 'Sign In').click();
    cy.url().should('include', '/signin');
    cy.get('h1').should('contain', 'Sign In');
  });

  it('Devrait afficher une erreur avec un username incorrects', () => {
    cy.contains('div', 'Sign In').click();
    cy.get('input[name="username"]').type('utilisateur_incorrect');
    cy.get('input[name="password"]').type('mot_de_passe_incorrect');
    cy.get('button[type="submit"]').click();
    cy.contains('Error: Username does not exist.').should('be.visible');
  });

  it('Devrait afficher une erreur avec un mot de passe incorrects', () => {
    cy.contains('div', 'Sign In').click();
    cy.get('input[name="username"]').type('test');
    cy.get('input[name="password"]').type('test12345');
    cy.get('button[type="submit"]').click();
    cy.contains('Error: Incorrect username or password.').should('be.visible');
  });

  it('Devrait se connecter avec des identifiants corrects', () => {
    cy.contains('div', 'Sign In').click();
    cy.get('input[name="username"]').type('test');
    cy.get('input[name="password"]').type('test1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', `${BASE_URL}/`);
    cy.contains('Sign Out').should('be.visible');
    cy.contains('div', 'Sign Out').should('exist');
  });

  it('Devrait se déconnecter correctement', () => {
    cy.contains('div', 'Sign In').click();
    cy.get('input[name="username"]').type('test');
    cy.get('input[name="password"]').type('test1234');
    cy.get('button[type="submit"]').click();
    cy.contains('Sign Out').should('be.visible');
    cy.contains('div', 'Sign Out').click();
    cy.contains('div', 'Sign In').should('be.visible');
    cy.contains('Sign Out').should('not.exist');
  });
});