describe("multi planner spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("should be a default planner", () => {
    cy.get("li").contains("Planner 1");
  });

  it("should be able to delete a planner", () => {
    cy.get("button").first().click();
    cy.contains("Planner 1").should("not.exist");
  });

  it("should be able to add a planner", () => {
    cy.get("button").eq(2).click();
    cy.contains("Planner 3");
  });
});
