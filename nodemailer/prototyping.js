// # node-email-templates

// ## Example with [Nodemailer](https://github.com/andris9/Nodemailer)

var path = require('path'),
  fs = require('fs'),
  nodemailer = require('nodemailer'),
  emailTemplates = require('email-templates'),
  templatesDir = path.resolve(__dirname, '..', 'templates'),
  loggerConfig = require('../config/env/log_config.json'),
  logger = require('aquajs-logger'),
  log;

logger.init(loggerConfig);
log = logger.getLogger();

emailTemplates(templatesDir, function (err, template) {

  if (err) {
    log.error('Error loading emailTemplates: %s', err);
  } else {

    // ## Send a single email

    // Prepare nodemailer transport object
    var transport = nodemailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        user: "uma.more96@gmail.com",
        pass: "umamore96"
      }
    });

    // An example users object with formatted email function
    var locals = {
      email: 'umore@equinix.com',
      name: {
        first: 'Mamma',
        last: 'Mia'
      }
    };

    var attachments = [{
      filename: 'test.txt',
      streamSource: fs.createReadStream('./test.txt')
    }, {
      filename: 'test.txt',
      streamSource: fs.createReadStream('./test.txt')
    }];

    // Send a single email with attachment
    template('newsletter', locals, function (err, html, text) {
      if (err) {
        log.error('Error loading template: %s', err);
      } else {
        transport.sendMail({
          from: 'aquaJSOnemail <admin@aquajs.com>',
          to: locals.email,
          subject: 'welcome to aquajs! (with attachment)',
          html: html,
          attachments: attachments,
          text: text
        }, function (err, responseStatus) {
          if (err) {
            log.error('Error sending message to: %s (error: %s, statusCode: %s', locals.email, err.message, err.status);
          } else {
            log.info('Email sent to: %s (responseStatus: %s)', locals.email, responseStatus.message);
          }
        });
      }
    });
  }
});