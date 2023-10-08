describe('app spec', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  
  it('contains() the quarters', () => {
    cy.contains("Fall");
    cy.contains("Winter");
    cy.contains("Spring");
  });

  it('contains() course names', () => {
    cy.contains("CSE 12");
    cy.contains("CSE 130");
    cy.contains("PHIL 11");
  });

  it('contains() group member names & emails', () => {
    cy.contains("Loading");
    // Wait for resp from GraphQL API
    cy.wait(5000);
    cy.contains("Teresa Wu");
    cy.contains("Lily Knab");
    cy.contains("Furkan Ercevik");
    cy.contains("Oscar Luthje");
    cy.contains("Ahmad Joseph");

    cy.contains("tqwu@ucsc.edu");
    cy.contains("lknab@ucsc.edu");
    cy.contains("fercevik@ucsc.edu");
    cy.contains("oluthje@ucsc.edu");
    cy.contains("aajoseph@ucsc.edu");
  })
})