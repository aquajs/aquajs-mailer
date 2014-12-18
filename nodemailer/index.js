var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    nodemailer = require('nodemailer')


/**
 * Constructor
 * @param templatePath - full path to templates base directory
 * @param options - options object
 * @constructor
 */
var Emailer = function (templatePath, options) {
  this.templatePath = templatePath || '.';
  this.options = options;
};


/**
 * Given a template file and data, renders an email message
 * @param pathname - relative path to file within templates base directory
 * @param data - an object with properties that match the template variables for setting values
 * @param callback - the second arg is the formatted message contents as a string
 */
Emailer.prototype.render = function (pathname, data, callback) {
  var template = path.join(this.templatePath, pathname);
  swig.renderFile(template, data, callback);
};


/**
 * Send an email via nodemailer
 * @param pathname - relative path to file within templates base directory to be rendered
 * @param data - an object with properties that match the template variables for setting values (data context)
 * @param mail - an object with email properties, such as to and from (email context)
 * @param callback - the second arg is true if successful
 */
Emailer.prototype.send = function (pathname, data, mail, callback) {

  //render the template. All required parameters are supplied via the data context. The rendered content to email will be called back as the message arg
  this.render(pathname, data, function (err, message) {
    if (err) return callback(err);

    // this is the rendered message
    // it's ready to email now
    console.log('logging message');
    console.log(message);
    console.log(mail);

    // TODO implement nodemailer send function. All required parameters should
    // be supplied to this function as part of the mail context
    // The credentials here reflect the *actual* account to use for sending email, not who the mail context says is the sender
    var transport = nodemailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        user: "peter.svet.test@gmail.com",
        pass: "equitest"
      }
    });

    var context = {
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      text: message,
      attachments: mail.attachments

    };

    transport.sendMail(context, function (err, responseStatus) {
      if (err) {
        console.error('Error sending message to: %s (error: %s, statusCode: %s', mail.to, err.message, err.status);
        return callback(err);
      } else {
        console.log('Email sent to: %s (responseStatus: %s)', mail.to, responseStatus.message);

        var result = {
          success: /OK/.test(responseStatus.message),
          status: responseStatus.message
        };

        callback(null, result);
      }
    });
  });
};


// export constructor
module.exports = Emailer;

