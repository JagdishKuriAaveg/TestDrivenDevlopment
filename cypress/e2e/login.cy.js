describe("Login Page", () => {
  const baseUrl = "http://localhost:5173";

  it("should render login form", () => {
    cy.visit(`${baseUrl}/login`);

    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('button[type="submit"]').should("contain", "Login");
  });

  it("should show validation errors on empty submit", () => {
    cy.visit(`${baseUrl}/login`);

    cy.get('button[type="submit"]').click();

    // Replace with actual error messages you show
    cy.contains("Email is required").should("exist");
    cy.contains("Password is required").should("exist");
  });

  it("should show error on invalid email format", () => {
    cy.visit(`${baseUrl}/login`);

    cy.get('input[name="email"]').type("invalid-email");
    cy.get('input[name="password"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.contains("Invalid email format").should("exist"); // Adjust this message to match your UI
  });

  it("should redirect on successful login", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { token: "fake-jwt-token" },
    }).as("loginRequest");

    cy.visit(`${baseUrl}/login`);

    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.url().should("include", "/dashboard");
  });
});
