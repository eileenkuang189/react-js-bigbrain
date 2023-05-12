context('Admin flow - happy path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/register');
  });

  it('Successfully gets around the admin pages', () => {
    cy.intercept('POST', '/admin/auth/login').as('login');
    cy.intercept('POST', '/admin/auth/register').as('register');
    cy.intercept('PUT', '/admin/quiz/*').as('update');
    cy.intercept('GET', '/admin/quiz/*').as('quiz');
    cy.intercept('POST', '/admin/quiz/*/start').as('startQuiz');
    cy.intercept('PUT', '/play/join/*').as('join');
    // register a new admin user
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    const name = 'test-name';
    const email = `test${randomNumber}@example.com`;
    const password = 'test';
    cy.get('input[name=register-name]')
      .focus()
      .type(name);
    cy.get('input[name=register-email]')
      .focus()
      .type(email);
    cy.get('input[name=register-password]')
      .focus()
      .type(password);
    cy.get('button[type=submit]')
      .click()

    cy.wait('@register').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.request.method).to.equal('POST');
      expect(interception.request.body).to.deep.equal({ email: `test${randomNumber}@example.com`, name: 'test-name', password: 'test' });
    });
    // switch to the login page
    cy.get('[name=link]')
      .click();

    // log the user in
    cy.get('input[name=login-email]')
      .focus()
      .type(email);
    cy.get('input[name=login-password]')
      .focus()
      .type(password);
    cy.get('button[type=submit]')
      .click()

    cy.wait('@login').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.request.method).to.equal('POST');
      expect(interception.request.body).to.deep.equal({ email: `test${randomNumber}@example.com`, password: 'test' });
    });

    cy.location().should((location) => {
      expect(location.href).to.eq('http://localhost:3000/dashboard');
    });

    // create a new quiz
    const newQuiz = 'new-quiz-name';
    cy.get('button[name=new-quiz]')
      .click();
    cy.get('input[name=new-quiz-name]')
      .focus()
      .type(newQuiz);
    cy.get('button[name=create-quiz')
      .click();

    // update a quiz by changing the name and the thumbnail
    cy.get('button[name=update-quiz]')
      .click();
    cy.location().should((location) => {
      expect(location.href).to.match(/^http:\/\/localhost:3000\/quiz\/\d+$/)
    });

    // upload a new thumbnail
    let file = null;
    cy.fixture('test.png').then(fileContent => {
      file = fileContent.toString();
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'testPicture.png',
        mimeType: 'image/png'
      });
    });

    // update the name of the quiz
    const quizName = 'test-quiz-name';
    cy.get('input[name=quiz-name]')
      .clear()
      .focus()
      .type(quizName);

    // press the update button
    cy.get('button[name=update-quiz]')
      .click();
    cy.wait('@update').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.request.method).to.equal('PUT');
    });

    // press the back button to go back to dashboard
    cy.get('button[name=edit-back]')
      .click();
    cy.location().should((location) => {
      expect(location.href).to.eq('http://localhost:3000/dashboard');
    });

    // start the quiz
    cy.get('button[name=start-quiz]')
      .click();
    cy.wait('@startQuiz').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.request.method).to.equal('POST');
    });
    // collect the sessionId and then join the play page with that sessionId
    cy.get('span[name=session-id]').invoke('text').then((text) => {
      cy.visit(`localhost:3000/play?pin=${text}`);
    });
    const playerName = 'player-name';
    cy.get('input[name=play-name]')
      .focus()
      .type(playerName);
    cy.get('button[type=submit]')
      .click();

    cy.location().should((location) => {
      expect(location.href).to.match(/http:\/\/localhost:3000\/play\/\d+\/lobby\/\d+\?name=[A-Za-z]+/);
    });
    cy.get('span[name=your-name]').invoke('text').then((text) => {
      expect(text).to.equal(playerName);
    })
  });
});