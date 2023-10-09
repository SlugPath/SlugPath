describe("app spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("contains() quarters", () => {
    cy.contains("Fall");
    cy.contains("Winter");
    cy.contains("Spring");
  });

  it("contains() course names", () => {
    cy.contains("CSE 12");
    cy.contains("CSE 130");
    cy.contains("PHIL 11");
  });
});
