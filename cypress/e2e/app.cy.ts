describe("app spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("contains() quarters", () => {
    cy.contains("Fall Freshman");
    cy.contains("Winter Freshman");
    cy.contains("Spring Freshman");
  });

  it("contains() course names", () => {
    cy.contains("CSE 1");
    cy.contains("CSE 2");
    cy.contains("CSE 3");
  });
});
