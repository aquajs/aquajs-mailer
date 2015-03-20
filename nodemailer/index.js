var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    nodemailer = require('nodemailer');

/**
 * Constructor
 * @param config - configuration passed via microservice
 * @param templatePath - full path to templates base directory
 * @param options - options object
 * @constructor
 */
var Emailer = function (config, templatePath, options) {
  this.config = config;
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
 * @param callback - a function that takes error and result args. If defined, the result
 *                   object will have success (boolean) and status (string) properties
 */
Emailer.prototype.send = function (pathname, data, mail, callback) {
  // render the template. All required parameters are supplied to the render
  // function via the data context. The rendered content ready to email will
  // be called back as the message arg
  this.render(pathname, data, function (err, message) {
    if (err) return callback(err);

    // The credentials here reflect the *actual* account to use for sending
    // email, not who the mail context says is the sender
    console.log(this.config)

    var transport = nodemailer.createTransport("SMTP", this.config.transport);

    var attachments = [];

    // if attachments array was passed, transform array to format expected by nodemailer
    if (mail.attachments) {
      if (!Array.isArray(mail.attachments)) {
        return callback("Message not sent: 'attachments' must be an array");
      }
      attachments = mail.attachments.map(function (filename) {
        return {filePath: filename};
      });
    }

    var context = {
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      attachments: attachments
    };

    if (mail.format === 'html') {
      context.html = message;
    } else {
      context.text = message;
    }

    transport.sendMail(context, function (err, responseStatus) {
      if (err) {
        console.error('Error sending message to: %s (error: %s, statusCode: %s', mail.to, err.message, err.status);
        return callback(err);
      } else {
        console.log('Email sent to: %s (responseStatus: %s)', mail.to, responseStatus.message);

        var result = {
          success: /OK|[Aa]ccepted/.test(responseStatus.message),
          status: responseStatus.message
        };

        callback(null, result);
      }
    });
  }.bind(this));
};


// export constructor
module.exports = Emailer;

