describe('Rotating Flesh Spirals browser tests', () => {
  it('visits the page', () => {
    cy.visit('https://quargsgreene.github.io/rotating-flesh-spirals/');
  });

  it('displays the canvas', () => {
    cy.get('#play').click();
  });
});
