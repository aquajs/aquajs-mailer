var assert = require('assert'),
    path = require('path'),
    fs = require('fs');

var loggerConfig = require('./log-config.json'),
    logger = require('aquajs-logger'),
    log;

var Emailer = require('..'),
    emailer,
    templatePath = path.join(__dirname, 'templates'),
    renderedPath = path.join(__dirname, 'expected-results');

var testAttachmentsPath = path.join(__dirname, './attachments');


before(function () {
  logger.init(loggerConfig);
  log = logger.getLogger();

  emailer = new Emailer(templatePath);
});


describe('basic email template tests', function () {

  it('should generate a formatted template', function (done) {
    var data = {name: 'Uma'};

    emailer.render('welcome/welcome.html', data, function (err, message) {
      if (err) return done(err);

      assertMessageMatchesExpected(message, 'welcome/welcome.html');

      done();
    });
  });
});


describe('send email tests', function () {

  this.timeout(5 * 1000);

  it('should send email with successful status', function (done) {
    var templateContext = {
      name: 'Uma'
    };

    var attachment1 = path.join(testAttachmentsPath, 'attachment1');
    var attachment2 = path.join(testAttachmentsPath, 'attachment2');

    var attachments = [
        attachment1,
        attachment2
    ];

    // note that who we say the email is from isn't necessarily the authorized account that the API will use to send the email
    var mailContext = {
      from: 'Uma More <uma.more96@gmail.com>',
      to: 'umore@equinix.com',
      subject: 'Hello',
      format: 'html',
      attachment: attachments
    };

    log.info('[emailtest] sending a test email');

    emailer.send('welcome/welcome.html', templateContext, mailContext, function (err, result) {
      if (err) return done(err);

      // assertMessageMatchesExpected(message, 'welcome/welcome.html');
      assert(result.success);

      done();
    });
  });
});


/**
 * Assert that the message actually matches what is expected
 * @param message - a string containing the message contents
 * @param expectedPath - a path to a file in within the ./expected-results directory containing what is expected
 */
function assertMessageMatchesExpected(message, expectedPath) {
  var expectedFile = path.join(renderedPath, expectedPath);
  var expectedContents = fs.readFileSync(expectedFile, {encoding: 'utf-8'});

  // strip carriage returns from CRLFs, only want newlines
  expectedContents = expectedContents.replace(/(\r)/gm, '');

  // verify the rendered message matches the expected contents
  assert.equal(message, expectedContents);
}

