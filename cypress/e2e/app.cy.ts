describe("app spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("should be able to add courses from modal", () => {
    // click on add course button
    cy.get(".MuiButton-startDecorator.css-187ulk2-JoyButton-startDecorator")
      .first()
      .click();

    // click first course checkbox
    cy.get(".MuiCheckbox-checkbox.css-j8hbqe-JoyCheckbox-checkbox")
      .first()
      .click();

    // click add course button
    cy.get(
      ".MuiButton-root.MuiButton-variantSolid.MuiButton-colorPrimary.MuiButton-sizeMd.flex.align-self-end.css-10eg45m-JoyButton-root",
    ).click();

    // verify that course is added to the list
    cy.contains("CSE");
  });
});
