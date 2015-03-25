aquajs-mailer
------------

Send swig-based templated text and HTML email over SMTP.


#### Usage
Be sure to supply credentials to `email-config.json` in your microservice's `config` directory. This will be the authorized email address used to actually send messages.

To send a message, call `emailer.send` with these arguments:
   * `template`: {string} Path to specific template within `templateDir` to be rendered in message
   * `data`: {object} Object containing properties corresponding with `template`
   * `mailContext`: {object} Object containing vital mail properties:
      - `from`: email address shown in recipient inbox (could be anything, because the address supplied in `email-config.json` is the one actually sending the message
      - `to`: recipient email address
      - `subject`: Subject line shown in message
      - `format`: Defaults to `text` unless set to `html`
      - `attachments`: Optional array of file paths
   * `callback`: {function} Function to handle whatever work upon completion. Returns `err` and `result` object containing `success`(boolean), and `status` (message from `nodemailer` response)

```
var Emailer = require('aquajs-mailer');
var config = require('./config/mailer/email-config.json');
var templateDir = <path to swig templates directory>;

var emailer = new Emailer(config, templateDir);

var data = {
  message: "Hello World"
}

var mailContext = {
  from: AquaJSAdmin <aquajsadmin@equinix.com>,
  to: example@gmail.com,
  subject: 'Welcome!',
  format: html
}

emailer.send('welcome/welcome.html', data, mailContext, function (err, result) {
  if (err) console.error('Message failed to send: ' + err);
  
  console.log('Message sent with status: %s', result.status);
});
