
// # node-email-templates

// ## Example with [Nodemailer](https://github.com/andris9/Nodemailer)

var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer')
  , fs             = require('fs');

emailTemplates(templatesDir, function(err, template) {

  if (err) {
    console.log(err);
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
    },{
      filename: 'test.txt',
      streamSource: fs.createReadStream('./test.txt')
    }];
    // Send a single email with attachment
    template('newsletter', locals, function(err, html, text) {
      if (err) {
        console.log(err);
      } else {
        transport.sendMail({
          from: 'aquaJSOnemail <admin@aquajs.com>',
          to: locals.email,
          subject: 'welcome to aquajs! (with attachment)',
          html: html,
          attachments: attachments,
          text: text
        }, function(err, responseStatus) {
          if (err) {
            console.log(err);
          } else {
            console.log(responseStatus.message);
          }
        });
      }
    });
  }
});

